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

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      const { data: { user: supabaseUser }, error } = await supabaseBrowserClient.auth.getUser();

      if (!mounted) return;

      if (error || !supabaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const appUser = await fetchUserFromDb(supabaseUser);
      if (mounted) {
        setUser(appUser);
        setIsLoading(false);
      }
    }

    fetchUser();

    const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (session?.user) {
          const appUser = await fetchUserFromDb(session.user);
          if (mounted) setUser(appUser);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
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
