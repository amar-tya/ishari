import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes yang tidak memerlukan authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/muhud',
  '/diba',
  '/kitab',
  '/bookmark',
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip untuk static files dan api routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // PENTING: jangan tambahkan kode antara createServerClient dan getUser
  // Lihat: https://supabase.com/docs/guides/auth/server-side/nextjs
  // Wrapped try/catch: jika Supabase tidak bisa dijangkau (network error/timeout),
  // treat sebagai unauthenticated — public routes tetap load, protected redirect ke login.
  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'] = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  const isAuthenticated = !!user;

  // Role dibaca dari app_metadata (JWT claim), bukan query DB.
  // app_metadata di-sync otomatis via trigger saat public.users.role berubah.
  const role: string = user?.app_metadata?.role ?? 'user';

  // Sudah login tapi akses halaman auth → redirect ke dashboard
  if (
    (pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/forgot-password') &&
    isAuthenticated
  ) {
    if (role !== 'user') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Belum login tapi akses halaman protected admin → redirect ke login
  const isPublic = isPublicRoute(pathname);
  if (!isPublic && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User biasa mencoba akses halaman admin -> redirect ke home public
  if (!isPublic && isAuthenticated && role === 'user') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match semua request kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
