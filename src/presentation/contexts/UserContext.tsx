'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/core/entities';
import { supabaseBrowserClient } from '@/infrastructure/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextValue>({ user: null, isLoading: true });

async function fetchUserFromDb(supabaseUser: SupabaseUser): Promise<User> {
  const queryPromise = supabaseBrowserClient
    .from('users')
    .select('id, email, username, role, is_active')
    .eq('id', supabaseUser.id)
    .single();

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('fetchUserFromDb timeout')), 8000)
  );

  const { data: dbUser, error } = await Promise.race([queryPromise, timeoutPromise]);

  // PGRST116 = no rows found (user baru, belum ada di public.users)
  if (error && error.code !== 'PGRST116') {
    throw new Error(`DB query failed: ${error.message}`);
  }

  return {
    id: dbUser?.id ?? supabaseUser.id,
    email: supabaseUser.email ?? '',
    username:
      dbUser?.username ??
      supabaseUser.user_metadata?.username ??
      supabaseUser.email ??
      '',
    role: dbUser?.role ?? supabaseUser.app_metadata?.role ?? supabaseUser.user_metadata?.role ?? 'user',
    is_active: dbUser?.is_active ?? true,
    last_login_at: supabaseUser.last_sign_in_at ?? new Date().toISOString(),
    created_at: supabaseUser.created_at ?? '',
    updated_at: supabaseUser.updated_at ?? '',
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Proactively trigger token refresh on mount. Penting untuk mobile (Android)
    // di mana @supabase/ssr berbasis cookies — memastikan refresh dimulai segera
    // sebelum menunggu INITIAL_SESSION event.
    void supabaseBrowserClient.auth.getSession();

    // Safety net: jika isLoading masih true setelah 10 detik (SDK bug, network mati
    // total, dll), paksa selesai agar UI tidak stuck selamanya.
    const safetyTimeoutId = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 10000);

    // onAuthStateChange fires INITIAL_SESSION immediately with the current
    // session (from cookies), so no separate getUser() call needed.
    const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          try {
            const appUser = await fetchUserFromDb(session.user);
            if (mounted) setUser(appUser);
          } catch {
            // Fallback ke data session Supabase jika DB query gagal
            if (mounted) {
              setUser({
                id: session.user.id,
                email: session.user.email ?? '',
                username:
                  session.user.user_metadata?.username ??
                  session.user.email ??
                  '',
                role:
                  session.user.app_metadata?.role ??
                  session.user.user_metadata?.role ??
                  'user',
                is_active: true,
                last_login_at:
                  session.user.last_sign_in_at ?? new Date().toISOString(),
                created_at: session.user.created_at ?? '',
                updated_at: session.user.updated_at ?? '',
              });
            }
          } finally {
            if (mounted) setIsLoading(false);
          }
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        // Memaksa Supabase cek dan refresh token saat user kembali ke tab.
        // TOKEN_REFRESHED akan fire jika refresh berhasil, SIGNED_OUT jika expired.
        await supabaseBrowserClient.auth.getSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(safetyTimeoutId);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext(): UserContextValue {
  return useContext(UserContext);
}
