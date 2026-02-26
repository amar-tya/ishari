import {
  BookmarkCreateRequest,
  BookmarkFilter,
  BookmarkResponse,
  BookmarkUpdateRequest,
} from '@/application/dto';
import { BookmarkEntity } from '@/core/entities';
import { mapResult, Result } from '@/core/types';
import { container } from '@/di/container';
import { useCallback } from 'react';

export interface UseBookmark {
  findBookmark: (criteria: BookmarkFilter) => Promise<Result<BookmarkResponse>>;
  createBookmark: (
    request: BookmarkCreateRequest
  ) => Promise<Result<BookmarkEntity>>;
  updateBookmark: (
    request: BookmarkUpdateRequest
  ) => Promise<Result<BookmarkEntity>>;
  deleteBookmark: (id: number) => Promise<Result<boolean>>;
}

export function useBookmark(): UseBookmark {
  const {
    findBookmarkUseCase,
    createBookmarkUseCase,
    updateBookmarkUseCase,
    deleteBookmarkUseCase,
  } = container;

  const findBookmark = useCallback(
    async (criteria: BookmarkFilter): Promise<Result<BookmarkResponse>> => {
      const result = await findBookmarkUseCase.execute(criteria);

      return mapResult(result, (res) => ({
        data: res.data,
        meta: res.meta,
      }));
    },
    [findBookmarkUseCase]
  );

  const createBookmark = useCallback(
    async (request: BookmarkCreateRequest): Promise<Result<BookmarkEntity>> => {
      const result = await createBookmarkUseCase.execute(request);
      return result;
    },
    [createBookmarkUseCase]
  );

  const updateBookmark = useCallback(
    async (request: BookmarkUpdateRequest): Promise<Result<BookmarkEntity>> => {
      const result = await updateBookmarkUseCase.execute(request);
      return result;
    },
    [updateBookmarkUseCase]
  );

  const deleteBookmark = useCallback(
    async (id: number): Promise<Result<boolean>> => {
      const result = await deleteBookmarkUseCase.execute(id);
      return result;
    },
    [deleteBookmarkUseCase]
  );

  return {
    findBookmark,
    createBookmark,
    updateBookmark,
    deleteBookmark,
  };
}
