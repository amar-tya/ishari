'use client';

import { useState, useCallback } from 'react';
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

  const getHadiList = useCallback(
    async (pageParam?: number, searchParam?: string) => {
      setIsLoading(true);
      setError(null);

      const currentPage = pageParam ?? page;
      const currentSearch = searchParam ?? search;

      try {
        const result = await listHadi({
          page: currentPage,
          search: currentSearch || undefined,
        });

        if (result.success) {
          setHadiList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [listHadi, page, search]
  );

  const storeHadi = useCallback(
    async (dto: CreateHadiDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createHadi(dto);
        if (result.success) {
          await getHadiList();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (error) {
        setError(getErrorMessage(error));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [createHadi, getHadiList]
  );

  const updateHadi = useCallback(
    async (id: number, dto: UpdateHadiDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateHadiHook(id, dto);
        if (result.success) {
          await getHadiList();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (error) {
        setError(getErrorMessage(error));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [updateHadiHook, getHadiList]
  );

  const removeHadi = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteHadi(id);
        if (result.success) {
          await getHadiList();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (error) {
        setError(getErrorMessage(error));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [deleteHadi, getHadiList]
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
