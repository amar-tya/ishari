'use client';

import { useState, useEffect } from 'react';
import { User } from '@/core/entities';
import { supabaseBrowserClient } from '@/infrastructure/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * useUser Hook
 *
 * Menggunakan onAuthStateChange sebagai satu-satunya sumber kebenaran
 * untuk auth state. Event INITIAL_SESSION langsung membawa session saat
 * listener dipasang, sehingga tidak perlu fetchUser() terpisah yang
 * bisa menyebabkan race condition.
 */
export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchUserFromDb(supabaseUser: SupabaseUser): Promise<User> {
      const { data: dbUser } = await supabaseBrowserClient
        .from('users')
        .select('*')
        .eq('email', supabaseUser.email)
        .single();

      return {
        id: dbUser?.id ?? supabaseUser.id,
        email: supabaseUser.email ?? '',
        username:
          dbUser?.username ??
          supabaseUser.user_metadata?.username ??
          supabaseUser.email ??
          '',
        role: dbUser?.role ?? supabaseUser.user_metadata?.role ?? 'user',
        is_active: dbUser?.is_active ?? true,
        last_login_at: supabaseUser.last_sign_in_at ?? new Date().toISOString(),
        created_at: supabaseUser.created_at ?? '',
        updated_at: supabaseUser.updated_at ?? '',
      };
    }

    // onAuthStateChange fires INITIAL_SESSION immediately with the current
    // session (from cookies), then TOKEN_REFRESHED / SIGNED_IN / SIGNED_OUT
    // as auth state changes. This is the single source of truth — no need
    // for a separate fetchUser() that would race with INITIAL_SESSION.
    const {
      data: { subscription },
    } = supabaseBrowserClient.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const appUser = await fetchUserFromDb(session.user);
        if (mounted) setUser(appUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return user;
}
