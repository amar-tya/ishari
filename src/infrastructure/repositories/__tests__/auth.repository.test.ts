import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { AuthRepository } from '../auth.repository';
import { HttpClient } from '@/infrastructure/http';
import { LoginCredentials, AuthResponse } from '@/core/entities';
import { ApiSuccessResponse } from '@/core/types';
import { success, failure } from '@/core/types';
import { NetworkError, UnauthorizedError } from '@/core/errors';

// Mock HttpClient
const createMockHttpClient = (): HttpClient =>
  ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }) as unknown as HttpClient;

const mockAuthResponse: AuthResponse = {
  user: {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    is_active: true,
    role: 'super_admin',
    last_login_at: '2026-01-16T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-16T00:00:00Z',
  },
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_at: '2026-01-17T00:00:00Z',
};

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let mockHttpClient: HttpClient;

  beforeEach(() => {
    mockHttpClient = createMockHttpClient();
    authRepository = new AuthRepository(mockHttpClient);
  });

  describe('login()', () => {
    it('harus return success dengan AuthResponse yang valid', async () => {
      const credentials: LoginCredentials = {
        username_or_email: 'testuser',
        password: 'password123',
      };

      const apiResponse: ApiSuccessResponse<AuthResponse> = {
        status: 'success',
        message: 'Login berhasil',
        data: mockAuthResponse,
      };

      (mockHttpClient.post as Mock).mockResolvedValue(
        success({ data: apiResponse })
      );

      const result = await authRepository.login(credentials);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthResponse);
      }
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials
      );
    });

    it('harus return failure jika HTTP request gagal', async () => {
      const credentials: LoginCredentials = {
        username_or_email: 'testuser',
        password: 'password123',
      };

      (mockHttpClient.post as Mock).mockResolvedValue(
        failure(new NetworkError('Tidak dapat terhubung ke server'))
      );

      const result = await authRepository.login(credentials);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(NetworkError);
      }
    });

    it('harus return failure jika credentials salah (401)', async () => {
      const credentials: LoginCredentials = {
        username_or_email: 'testuser',
        password: 'wrongpassword',
      };

      (mockHttpClient.post as Mock).mockResolvedValue(
        failure(new UnauthorizedError('Username atau password salah'))
      );

      const result = await authRepository.login(credentials);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(UnauthorizedError);
      }
    });
  });

  describe('logout()', () => {
    it('harus return success setelah logout berhasil', async () => {
      (mockHttpClient.post as Mock).mockResolvedValue(success({ data: null }));

      const result = await authRepository.logout();

      expect(result.success).toBe(true);
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/auth/logout',
        undefined,
        {}
      );
    });

    it('harus return failure jika logout gagal', async () => {
      (mockHttpClient.post as Mock).mockResolvedValue(
        failure(new NetworkError('Tidak dapat terhubung ke server'))
      );

      const result = await authRepository.logout();

      expect(result.success).toBe(false);
    });
  });

  describe('refreshToken()', () => {
    it('harus return success dengan token baru', async () => {
      const refreshToken = 'old-refresh-token';

      const apiResponse: ApiSuccessResponse<AuthResponse> = {
        status: 'success',
        message: 'Token refreshed',
        data: mockAuthResponse,
      };

      (mockHttpClient.post as Mock).mockResolvedValue(
        success({ data: apiResponse })
      );

      const result = await authRepository.refreshToken(refreshToken);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthResponse);
      }
      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refresh_token: refreshToken,
      });
    });

    it('harus return failure jika refresh token expired', async () => {
      const refreshToken = 'expired-refresh-token';

      (mockHttpClient.post as Mock).mockResolvedValue(
        failure(new UnauthorizedError('Refresh token expired'))
      );

      const result = await authRepository.refreshToken(refreshToken);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(UnauthorizedError);
      }
    });
  });
});
