import { AuthResponse, User } from '@/core/entities';
import { IAuthService } from '@/application/ports';
import { supabaseBrowserClient } from '@/infrastructure/supabase';

/**
 * AuthService - Supabase Session Management
 *
 * Menggunakan Supabase untuk session management.
 * Token storage ditangani otomatis oleh @supabase/ssr via cookies.
 */
export class AuthService implements IAuthService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  storeTokens(_authResponse: AuthResponse): void {
    // Supabase mengelola session storage secara otomatis via cookies
    // Method ini dipertahankan untuk kompatibilitas interface
  }

  getAccessToken(): string | null {
    // Supabase menyimpan session di localStorage (clientside)
    // Gunakan getSession() untuk async, atau session dari localStorage
    const session = supabaseBrowserClient.auth.getUser();
    void session; // async - tidak bisa sync di sini

    // Ambil dari localStorage yang dikelola Supabase
    if (typeof localStorage !== 'undefined') {
      const keys = Object.keys(localStorage);
      const sessionKey = keys.find((k) => k.includes('auth-token'));
      if (sessionKey) {
        try {
          const data = JSON.parse(localStorage.getItem(sessionKey) ?? '{}');
          return data?.access_token ?? null;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      const keys = Object.keys(localStorage);
      const sessionKey = keys.find((k) => k.includes('auth-token'));
      if (sessionKey) {
        try {
          const data = JSON.parse(localStorage.getItem(sessionKey) ?? '{}');
          return data?.refresh_token ?? null;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  clearTokens(): void {
    // Supabase akan clear session via signOut()
    // AuthRepository.logout() memanggil supabase.auth.signOut()
  }

  hasValidSession(): boolean {
    // Cek access token di localStorage dan validasi expiry-nya
    if (typeof localStorage === 'undefined') return false;
    try {
      const keys = Object.keys(localStorage);
      const sessionKey = keys.find((k) => k.includes('auth-token'));
      if (!sessionKey) return false;
      const data = JSON.parse(localStorage.getItem(sessionKey) ?? '{}');
      const expiresAt: number | undefined = data?.expires_at;
      if (!expiresAt) return false;
      // Buffer 60 detik agar tidak race antara check dan actual expiry
      return expiresAt - 60 > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  getUser(): User | null {
    if (typeof localStorage !== 'undefined') {
      const keys = Object.keys(localStorage);
      const sessionKey = keys.find((k) => k.includes('auth-token'));
      if (sessionKey) {
        try {
          const data = JSON.parse(localStorage.getItem(sessionKey) ?? '{}');
          const supabaseUser = data?.user;
          if (!supabaseUser) return null;
          return {
            id: supabaseUser.id,
            email: supabaseUser.email ?? '',
            username:
              supabaseUser.user_metadata?.username ?? supabaseUser.email ?? '',
            role: supabaseUser.user_metadata?.role ?? 'user',
            is_active: true,
            last_login_at: new Date().toISOString(),
            created_at: supabaseUser.created_at ?? '',
            updated_at: supabaseUser.updated_at ?? '',
          };
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  clearUser(): void {
    // Dikelola oleh Supabase signOut()
  }
}
