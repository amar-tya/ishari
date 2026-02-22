import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const REQUEST_TIMEOUT = 30000; // 30 seconds

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RefreshTokenResponse {
  status: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export const GET = (req: NextRequest) => handleRequest(req, 'GET');
export const POST = (req: NextRequest) => handleRequest(req, 'POST');
export const PUT = (req: NextRequest) => handleRequest(req, 'PUT');
export const DELETE = (req: NextRequest) => handleRequest(req, 'DELETE');
export const PATCH = (req: NextRequest) => handleRequest(req, 'PATCH');

/**
 * Refresh access token menggunakan refresh token
 */
async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshTokenResponse | null> {
  console.log('Attempting to refresh token...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    console.log(`Refresh token response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Refresh token failed with status ${response.status}. Body: ${errorText}`
      );
      return null;
    }

    const data = await response.json();
    console.log('Refresh token success!', !!data.data?.access_token);
    return data;
  } catch (err) {
    console.error('Error during refresh fetch:', err);
    return null;
  }
}

/**
 * Execute fetch request dengan token
 */
async function executeRequest(
  targetUrl: string,
  method: HttpMethod,
  headers: Headers,
  body: string | undefined,
  signal: AbortSignal
): Promise<Response> {
  return fetch(targetUrl, {
    method,
    headers,
    body,
    signal,
    redirect: 'follow',
  });
}

/**
 * Handle proxy request ke backend API
 * Route ini berfungsi sebagai proxy untuk menyembunyikan token dari client
 * dan melakukan auto-refresh token jika expired
 */
async function handleRequest(request: NextRequest, method: HttpMethod) {
  // Validasi API_BASE_URL
  if (!API_BASE_URL) {
    console.error('NEXT_PUBLIC_API_BASE_URL is not configured');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const { pathname, search } = request.nextUrl;
  const path = pathname.replace('/api/proxy', '');
  const targetUrl = `${API_BASE_URL}${path}${search}`;

  // Ambil tokens dari HttpOnly cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  // Build headers
  const buildHeaders = (token?: string): Headers => {
    const headers = new Headers();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Forward relevant headers dari client
    const excludedHeaders = new Set([
      'host',
      'connection',
      'authorization',
      'content-length',
      'transfer-encoding',
    ]);

    request.headers.forEach((value, key) => {
      if (!excludedHeaders.has(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    return headers;
  };

  // Handle request body
  let body: string | undefined;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await request.text();
  }

  // Setup timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    let headers = buildHeaders(accessToken);

    // Set Content-Type jika belum ada
    if (body && !headers.has('content-type')) {
      headers.set('Content-Type', 'application/json');
    }

    let response = await executeRequest(
      targetUrl,
      method,
      headers,
      body,
      controller.signal
    );

    console.log(
      `Proxy request to ${targetUrl} returned status: ${response.status}`
    );

    // Jika 401 dan ada refresh token, coba refresh
    if (response.status === 401 && refreshToken) {
      const refreshResult = await refreshAccessToken(refreshToken);

      if (refreshResult?.status === 'success' && refreshResult.data) {
        const newAccessToken = refreshResult.data.access_token;
        const newRefreshToken = refreshResult.data.refresh_token;

        // Retry request dengan token baru
        headers = buildHeaders(newAccessToken);
        if (body && !headers.has('content-type')) {
          headers.set('Content-Type', 'application/json');
        }

        response = await executeRequest(
          targetUrl,
          method,
          headers,
          body,
          controller.signal
        );

        // Update cookies dengan token baru
        const jsonResponse = await createJsonResponse(response);

        // Set new tokens in cookies
        jsonResponse.cookies.set('access_token', newAccessToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/',
        });

        jsonResponse.cookies.set('refresh_token', newRefreshToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        });

        clearTimeout(timeoutId);
        return jsonResponse;
      } else {
        console.error('Failed to refresh token in proxy:', refreshResult);
      }
    }

    clearTimeout(timeoutId);
    return await createJsonResponse(response);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Timeout', message: 'Request timeout' },
        { status: 504 }
      );
    }

    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal Error', message: 'Tidak dapat terhubung ke server' },
      { status: 500 }
    );
  }
}

/**
 * Create NextResponse from fetch Response
 */
async function createJsonResponse(response: Response): Promise<NextResponse> {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  }

  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: {
      'Content-Type': contentType || 'text/plain',
    },
  });
}
