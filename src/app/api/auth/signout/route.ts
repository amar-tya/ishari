import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * GET /api/auth/signout
 *
 * Server-side logout via Supabase SSR.
 * Melakukan signOut di server agar Supabase auth cookies benar-benar terhapus,
 * lalu redirect ke /login.
 *
 * Ini diperlukan karena browser client tidak bisa menghapus HttpOnly cookies
 * yang di-set oleh server/middleware.
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));

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

  await supabase.auth.signOut();

  return response;
}
