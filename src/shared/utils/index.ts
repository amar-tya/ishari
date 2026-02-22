/**
 * Shared Utilities
 */

/**
 * Extract error message dari berbagai format error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    // Prioritize specific error detail over general message
    if (typeof errorObj.error === 'string') {
      return errorObj.error;
    }
    if (typeof errorObj.message === 'string') {
      return errorObj.message;
    }
  }

  return 'Terjadi kesalahan tidak dikenal';
}

/**
 * Sleep utility untuk delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Type-safe object check
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export * from './storage';
