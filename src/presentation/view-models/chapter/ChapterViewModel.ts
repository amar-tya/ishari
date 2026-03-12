'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useChapter } from '@/presentation/hooks';
import {
  ChapterCreateRequest,
  ChapterRequest,
  ChapterResponse,
  ChapterUpdateRequest,
} from '@/application/dto';
import { ChapterViewModel } from './ChapterViewModel.types';
import { getErrorMessage } from '@/shared/utils';

export type {
  ChapterViewModel,
  ChapterViewModelState,
  ChapterViewModelActions,
} from './ChapterViewModel.types';

export function useChapterViewModel(): ChapterViewModel {
  const {
    findChapter: findChapterHook,
    createChapter: createChapterHook,
    updateChapter: updateChapterHook,
    deleteChapter: deleteChapterHook,
    bulkDeleteChapter: bulkDeleteChapterHook,
  } = useChapter();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chapterList, setChapterList] = useState<ChapterResponse | null>(null);
  const [criteria, setCriteria] = useState<ChapterRequest>({
    page: 1,
    limit: 10,
    bookId: undefined,
    search: undefined,
    category: undefined,
    chapterId: undefined,
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Action
  const findChapter = useCallback(
    async (newCriteria?: Partial<ChapterRequest>, options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setIsLoading(true);
        setError(null);
      }

      let criteriaToUse = criteria;

      if (newCriteria) {
        criteriaToUse = { ...criteria, ...newCriteria };
        setCriteria(criteriaToUse);
      }

      try {
        const result = await findChapterHook(criteriaToUse);
        if (!mountedRef.current) return;

        if (result.success) {
          setChapterList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
      } finally {
        if (mountedRef.current && !options?.silent) setIsLoading(false);
      }
    },
    [findChapterHook, criteria]
  );

  const fetchRef = useRef(findChapter);
  fetchRef.current = findChapter;

  const createChapter = useCallback(
    async (data: ChapterCreateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createChapterHook(data);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [createChapterHook]
  );

  const updateChapter = useCallback(
    async (data: ChapterUpdateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateChapterHook(data);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [updateChapterHook]
  );

  const deleteChapter = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteChapterHook(id);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [deleteChapterHook]
  );

  const bulkDeleteChapter = useCallback(
    async (ids: number[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await bulkDeleteChapterHook(ids);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [bulkDeleteChapterHook]
  );

  return {
    isLoading,
    error,
    chapterList,
    findChapter,
    setCriteria,
    createChapter,
    updateChapter,
    deleteChapter,
    bulkDeleteChapter,
  };
}
