import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * OAuth Callback Route Handler
 *
 * Menerima code dari Supabase setelah Google OAuth consent.
 * Exchange code menjadi session, lalu redirect ke dashboard.
 *
 * PENTING: response redirect dibuat DULU, baru session cookies ditulis
 * langsung ke response object tersebut. Jika menggunakan cookieStore
 * dari next/headers, cookies tidak ikut terbawa ke NextResponse.redirect()
 * di Vercel production.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  const origin = requestUrl.origin;
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  const redirectBase = isLocalEnv
    ? origin
    : forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  if (code) {
    // Buat response redirect DULU, baru cookies ditulis langsung ke dalamnya
    const response = NextResponse.redirect(`${redirectBase}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  return NextResponse.redirect(
    `${redirectBase}/login?error=Gagal+login+dengan+Google`
  );
}
