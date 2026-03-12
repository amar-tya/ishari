'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { VerseMediaEntityList } from '@/core/entities';
import { useVerseMedia } from '@/presentation/hooks';
import { getErrorMessage } from '@/shared/utils';
import type { VerseMediaViewModel } from './VerseMediaViewModel.types';
import { CreateVerseMediaDTO, UpdateVerseMediaDTO } from '@/application/dto';

export function useVerseMediaViewModel(): VerseMediaViewModel {
  const {
    uploadVerseMedia,
    updateVerseMedia: updateVerseMediaHook,
    listVerseMedia,
    deleteVerseMedia,
  } = useVerseMedia();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verseMediaList, setVerseMediaList] =
    useState<VerseMediaEntityList | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [hadiId, setHadiId] = useState<number | null>(null);
  const [verseId, setVerseId] = useState<number | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const getVerseMediaList = useCallback(
    async (
      pageParam?: number,
      searchParam?: string,
      hadiIdParam?: number,
      verseIdParam?: number,
      options?: { silent?: boolean }
    ) => {
      if (!options?.silent) {
        setIsLoading(true);
        setError(null);
      }

      const currentPage = pageParam ?? page;
      const currentSearch = searchParam !== undefined ? searchParam : search;
      const currentHadi = hadiIdParam !== undefined ? hadiIdParam : hadiId;
      const currentVerse = verseIdParam !== undefined ? verseIdParam : verseId;

      try {
        const result = await listVerseMedia({
          page: currentPage,
          search: currentSearch || undefined,
          hadiId: currentHadi || undefined,
          verseId: currentVerse || undefined,
        });

        if (!mountedRef.current) return;

        if (result.success) {
          setVerseMediaList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
      } finally {
        if (mountedRef.current && !options?.silent) setIsLoading(false);
      }
    },
    [listVerseMedia, page, search, hadiId, verseId]
  );

  const fetchRef = useRef(getVerseMediaList);
  fetchRef.current = getVerseMediaList;

  const storeVerseMedia = useCallback(
    async (dto: CreateVerseMediaDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await uploadVerseMedia(dto);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, undefined, undefined, undefined, { silent: true });
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
    [uploadVerseMedia]
  );

  const updateVerseMedia = useCallback(
    async (id: number, dto: UpdateVerseMediaDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateVerseMediaHook(id, dto);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, undefined, undefined, undefined, { silent: true });
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
    [updateVerseMediaHook]
  );

  const removeVerseMedia = useCallback(
    async (id: number, storagePath: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteVerseMedia(id, storagePath);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, undefined, undefined, undefined, { silent: true });
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
    [deleteVerseMedia]
  );

  return {
    isLoading,
    error,
    verseMediaList,
    getVerseMediaList,
    setPage,
    setSearch,
    setHadiId,
    setVerseId,
    storeVerseMedia,
    updateVerseMedia,
    removeVerseMedia,
  };
}
