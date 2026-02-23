import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { LoginUseCase } from '../login.usecase';
import { IAuthRepository, IAuthService } from '@/application/ports';
import { AuthResponse, LoginCredentials } from '@/core/entities';
import { success, failure } from '@/core/types';
import { ValidationError, UnauthorizedError } from '@/core/errors';

// Mock implementations
const createMockAuthRepository = (): IAuthRepository => ({
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
});

const createMockAuthService = (): IAuthService => ({
  storeTokens: vi.fn(),
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn(),
  clearTokens: vi.fn(),
  hasValidSession: vi.fn(),
  getUser: vi.fn(),
  clearUser: vi.fn(),
});

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

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockAuthRepository: IAuthRepository;
  let mockAuthService: IAuthService;

  beforeEach(() => {
    mockAuthRepository = createMockAuthRepository();
    mockAuthService = createMockAuthService();
    loginUseCase = new LoginUseCase(mockAuthRepository, mockAuthService);
  });

  describe('Validasi Input', () => {
    it('harus return ValidationError jika username_or_email kosong', async () => {
      const credentials: LoginCredentials = {
        username_or_email: '',
        password: 'password123',
      };

      const result = await loginUseCase.execute(credentials);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.message).toBe('Username atau email harus diisi');
      }
    });

    it('harus return ValidationError jika username_or_email hanya whitespace', async () => {
      const credentials: LoginCredentials = {
        username_or_email: '   ',
        password: 'password123',
      };

      const result = await loginUseCase.execute(credentials);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it('harus return ValidationError jika password kosong', async () => {
      const credentials: LoginCredentials = {
        username_or_email: 'testuser',
        password: '',
      };

      const result = await loginUseCase.execute(credentials);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.message).toBe('Password harus diisi');
      }
    });
  });

  describe('Login Flow', () => {
    it('harus return failure jika login API gagal', async () => {
      const credentials: LoginCredentials = {
        username_or_email: 'testuser',
        password: 'wrongpassword',
      };

      (mockAuthRepository.login as Mock).mockResolvedValue(
        failure(new UnauthorizedError('Username atau password salah'))
      );

      const result = await loginUseCase.execute(credentials);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(UnauthorizedError);
      }
      expect(mockAuthRepository.login).toHaveBeenCalledWith(credentials);
      expect(mockAuthService.storeTokens).not.toHaveBeenCalled();
    });

    it('harus return success dan simpan tokens jika login berhasil', async () => {
      const credentials: LoginCredentials = {
        username_or_email: 'testuser',
        password: 'correctpassword',
      };

      (mockAuthRepository.login as Mock).mockResolvedValue(
        success(mockAuthResponse)
      );

      const result = await loginUseCase.execute(credentials);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthResponse);
      }
      expect(mockAuthRepository.login).toHaveBeenCalledWith(credentials);
      expect(mockAuthService.storeTokens).toHaveBeenCalledWith(
        mockAuthResponse
      );
    });

    it('harus memanggil repository dengan credentials yang benar', async () => {
      const credentials: LoginCredentials = {
        username_or_email: 'admin@example.com',
        password: 'admin123',
      };

      (mockAuthRepository.login as Mock).mockResolvedValue(
        success(mockAuthResponse)
      );

      await loginUseCase.execute(credentials);

      expect(mockAuthRepository.login).toHaveBeenCalledWith({
        username_or_email: 'admin@example.com',
        password: 'admin123',
      });
    });
  });
});
