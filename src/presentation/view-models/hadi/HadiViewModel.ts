'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { HadiEntityList } from '@/core/entities';
import { useHadi } from '@/presentation/hooks';
import { getErrorMessage } from '@/shared/utils';
import type { HadiViewModel } from './HadiViewModel.types';
import { CreateHadiDTO, UpdateHadiDTO } from '@/application/dto';

export function useHadiViewModel(): HadiViewModel {
  const {
    createHadi,
    updateHadi: updateHadiHook,
    listHadi,
    deleteHadi,
  } = useHadi();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hadiList, setHadiList] = useState<HadiEntityList | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const getHadiList = useCallback(
    async (pageParam?: number, searchParam?: string, options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setIsLoading(true);
        setError(null);
      }

      const currentPage = pageParam ?? page;
      const currentSearch = searchParam ?? search;

      try {
        const result = await listHadi({
          page: currentPage,
          search: currentSearch || undefined,
        });

        if (!mountedRef.current) return;

        if (result.success) {
          setHadiList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
      } finally {
        if (mountedRef.current && !options?.silent) setIsLoading(false);
      }
    },
    [listHadi, page, search]
  );

  const fetchRef = useRef(getHadiList);
  fetchRef.current = getHadiList;

  const storeHadi = useCallback(
    async (dto: CreateHadiDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createHadi(dto);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (error) {
        if (mountedRef.current) setError(getErrorMessage(error));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [createHadi]
  );

  const updateHadi = useCallback(
    async (id: number, dto: UpdateHadiDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateHadiHook(id, dto);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (error) {
        if (mountedRef.current) setError(getErrorMessage(error));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [updateHadiHook]
  );

  const removeHadi = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteHadi(id);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (error) {
        if (mountedRef.current) setError(getErrorMessage(error));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [deleteHadi]
  );

  return {
    isLoading,
    error,
    hadiList,
    getHadiList,
    setPage,
    setSearch,
    storeHadi,
    updateHadi,
    removeHadi,
  };
}
