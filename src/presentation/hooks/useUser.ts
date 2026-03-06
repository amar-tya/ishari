'use client';

import { useState, useEffect } from 'react';
import { User } from '@/core/entities';
import { supabaseBrowserClient } from '@/infrastructure/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * useUser Hook
 *
 * Hook untuk mendapatkan user data dari localStorage.
 * Handles SSR/hydration dengan benar - mulai dengan null,
 * lalu update setelah component mount di client.
 */
export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchUserFromDb(supabaseUser: SupabaseUser): Promise<User> {
      // Fetch user data from public.users table to get the actual role
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

    async function fetchUser() {
      // Get the current session user directly from Supabase
      const {
        data: { user: supabaseUser },
        error,
      } = await supabaseBrowserClient.auth.getUser();

      if (!mounted) return;

      if (error || !supabaseUser) {
        setUser(null);
        return;
      }

      const appUser = await fetchUserFromDb(supabaseUser);
      if (mounted) setUser(appUser);
    }

    fetchUser();

    // Set up auth state listener to update user when auth state changes (e.g. login/logout)
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
