'use client';

import { useUserContext } from '@/presentation/contexts/UserContext';

/**
 * useUser Hook
 *
 * Reads from UserContext (single shared auth fetch for the whole app).
 */
export function useUser() {
  return useUserContext();
}
