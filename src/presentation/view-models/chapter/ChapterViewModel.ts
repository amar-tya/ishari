'use client';

import { useCallback, useState } from 'react';
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

  // Action
  const findChapter = useCallback(
    async (newCriteria?: Partial<ChapterRequest>) => {
      setIsLoading(true);
      setError(null);

      let criteriaToUse = criteria;

      if (newCriteria) {
        criteriaToUse = { ...criteria, ...newCriteria };
        setCriteria(criteriaToUse);
      }

      try {
        const result = await findChapterHook(criteriaToUse);
        if (result.success) {
          setChapterList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [findChapterHook, criteria]
  );

  const createChapter = useCallback(
    async (criteria: ChapterCreateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createChapterHook(criteria);
        if (result.success) {
          await findChapter();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [createChapterHook, findChapter]
  );

  const updateChapter = useCallback(
    async (criteria: ChapterUpdateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateChapterHook(criteria);
        if (result.success) {
          await findChapter();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [updateChapterHook, findChapter]
  );

  const deleteChapter = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteChapterHook(id);
        if (result.success) {
          await findChapter();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [deleteChapterHook, findChapter]
  );

  const bulkDeleteChapter = useCallback(
    async (ids: number[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await bulkDeleteChapterHook(ids);
        if (result.success) {
          await findChapter();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [bulkDeleteChapterHook, findChapter]
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
