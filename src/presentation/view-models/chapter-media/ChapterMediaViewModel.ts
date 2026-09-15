'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChapterMediaEntityList } from '@/core/entities';
import { useChapterMedia } from '@/presentation/hooks';
import { getErrorMessage } from '@/shared/utils';
import type { ChapterMediaViewModel } from './ChapterMediaViewModel.types';
import { CreateChapterMediaDTO, UpdateChapterMediaDTO } from '@/application/dto';

export function useChapterMediaViewModel(): ChapterMediaViewModel {
  const {
    uploadChapterMedia,
    updateChapterMedia: updateChapterMediaHook,
    listChapterMedia,
    deleteChapterMedia,
  } = useChapterMedia();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chapterMediaList, setChapterMediaList] =
    useState<ChapterMediaEntityList | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [chapterId, setChapterId] = useState<number | null>(null);
  const [hadiId, setHadiId] = useState<number | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const getChapterMediaList = useCallback(
    async (
      pageParam?: number,
      searchParam?: string,
      chapterIdParam?: number,
      hadiIdParam?: number,
      options?: { silent?: boolean }
    ) => {
      if (!options?.silent) {
        setIsLoading(true);
        setError(null);
      }

      const currentPage = pageParam ?? page;
      const currentSearch = searchParam !== undefined ? searchParam : search;
      const currentChapter =
        chapterIdParam !== undefined ? chapterIdParam : chapterId;
      const currentHadi = hadiIdParam !== undefined ? hadiIdParam : hadiId;

      try {
        const result = await listChapterMedia({
          page: currentPage,
          search: currentSearch || undefined,
          chapterId: currentChapter || undefined,
          hadiId: currentHadi || undefined,
        });

        if (!mountedRef.current) return;

        if (result.success) {
          setChapterMediaList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
      } finally {
        if (mountedRef.current && !options?.silent) setIsLoading(false);
      }
    },
    [listChapterMedia, page, search, chapterId, hadiId]
  );

  const fetchRef = useRef(getChapterMediaList);
  fetchRef.current = getChapterMediaList;

  const storeChapterMedia = useCallback(
    async (dto: CreateChapterMediaDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await uploadChapterMedia(dto);
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
    [uploadChapterMedia]
  );

  const updateChapterMedia = useCallback(
    async (id: number, dto: UpdateChapterMediaDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateChapterMediaHook(id, dto);
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
    [updateChapterMediaHook]
  );

  const removeChapterMedia = useCallback(
    async (id: number, storagePath: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteChapterMedia(id, storagePath);
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
    [deleteChapterMedia]
  );

  return {
    isLoading,
    error,
    chapterMediaList,
    getChapterMediaList,
    setPage,
    setSearch,
    setChapterId,
    setHadiId,
    storeChapterMedia,
    updateChapterMedia,
    removeChapterMedia,
  };
}
