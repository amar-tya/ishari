'use client';

import { useCallback } from 'react';
import { container } from '@/di';
import { LoginCredentials, AuthResponse } from '@/core/entities';
import { Result } from '@/core/types';

/**
 * Auth Hook Return Type
 */
export interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<Result<AuthResponse>>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  getAccessToken: () => string | null;
}

/**
 * useAuth Hook
 *
 * Reusable hook untuk auth operations:
 * - Login email/password via Supabase
 * - Login dengan Google OAuth via Supabase
 * - Logout
 * - Check session
 */
export function useAuth(): UseAuthReturn {
  const { authService, authRepository, loginUseCase } = container;

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<Result<AuthResponse>> => {
      return loginUseCase.execute(credentials);
    },
    [loginUseCase]
  );

  const loginWithGoogle = useCallback(async () => {
    await authRepository.loginWithGoogle();
    // Supabase akan redirect browser ke Google secara otomatis
  }, [authRepository]);

  const logout = useCallback(async () => {
    // Redirect ke server-side signout route agar Supabase auth cookies
    // benar-benar terhapus di server sebelum masuk ke /login
    window.location.href = '/api/auth/signout';
  }, []);

  const isAuthenticated = useCallback(() => {
    return authService.hasValidSession();
  }, [authService]);

  const getAccessToken = useCallback(() => {
    return authService.getAccessToken();
  }, [authService]);

  return {
    login,
    loginWithGoogle,
    logout,
    isAuthenticated,
    getAccessToken,
  };
}
