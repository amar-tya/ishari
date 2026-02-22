import {
  AppError,
  NetworkError,
  TimeoutError,
  createErrorFromStatus,
} from '@/core/errors';
import { Result, success, failure } from '@/core/types';
import {
  HttpClient,
  HttpClientConfig,
  HttpResponse,
  RequestOptions,
} from './httpClient';

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * API Error Response dari server
 */
interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * FetchHttpClient - Implementation of HttpClient using native fetch
 * Dengan built-in error handling, timeout, dan interceptors
 */
export class FetchHttpClient implements HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL ?? '';
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  async get<T>(
    url: string,
    options?: RequestOptions
  ): Promise<Result<HttpResponse<T>>> {
    return this.request<T>(url, 'GET', undefined, options);
  }

  async post<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<Result<HttpResponse<T>>> {
    return this.request<T>(url, 'POST', body, options);
  }

  async put<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<Result<HttpResponse<T>>> {
    return this.request<T>(url, 'PUT', body, options);
  }

  async patch<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<Result<HttpResponse<T>>> {
    return this.request<T>(url, 'PATCH', body, options);
  }

  async delete<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<Result<HttpResponse<T>>> {
    return this.request<T>(url, 'DELETE', body, options);
  }

  private async request<T>(
    url: string,
    method: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<Result<HttpResponse<T>>> {
    const fullUrl = this.buildUrl(url);
    const headers = this.buildHeaders(options?.headers);
    const timeout = options?.timeout ?? this.timeout;

    // Setup AbortController untuk timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: options?.signal ?? controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      // Parse response body
      const contentType = response.headers.get('content-type');
      let data: T;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as T;
      }

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = data as unknown as ApiErrorResponse;
        const message =
          errorData?.error ??
          errorData?.message ??
          `HTTP Error ${response.status}`;
        const errors = errorData?.errors;

        return failure(createErrorFromStatus(response.status, message, errors));
      }

      return success({
        data,
        status: response.status,
        headers: response.headers,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      return failure(this.handleFetchError(error));
    }
  }

  private buildUrl(url: string): string {
    // Skip baseURL for absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Skip baseURL for internal Next.js API routes (e.g., /api/auth/logout)
    if (url.startsWith('/api/')) {
      return url;
    }
    return `${this.baseURL}${url}`;
  }

  private buildHeaders(customHeaders?: Record<string, string>): Headers {
    const headers = new Headers();

    // Set default headers
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    // Apply configured default headers
    Object.entries(this.defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    // Apply custom headers (override defaults)
    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    return headers;
  }

  private handleFetchError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      // Timeout/Abort
      if (error.name === 'AbortError') {
        return new TimeoutError('Request timeout', error);
      }

      // Network error (no internet, DNS failure, etc)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return new NetworkError('Tidak dapat terhubung ke server', error);
      }

      return new NetworkError(error.message, error);
    }

    return new NetworkError('Terjadi kesalahan tidak dikenal', error);
  }
}

/**
 * Factory function untuk membuat HTTP Client
 */
export function createHttpClient(config?: HttpClientConfig): HttpClient {
  return new FetchHttpClient(config);
}

/**
 * Default client instance dengan base URL dari environment
 */
export const httpClient = createHttpClient({
  baseURL: '/api/proxy',
});
