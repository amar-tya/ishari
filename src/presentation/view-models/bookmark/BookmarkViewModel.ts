import {
  BookmarkCreateRequest,
  BookmarkFilter,
  BookmarkResponse,
  BookmarkUpdateRequest,
} from '@/application/dto';
import { useBookmark } from '@/presentation/hooks/useBookmark';
import { useCallback, useState } from 'react';
import {
  BookmarkViewModel,
  BookmarkViewModelActions,
  BookmarkViewModelState,
} from './BookmarkViewModel.types';
import { getErrorMessage } from '@/shared/utils';

export type {
  BookmarkViewModel,
  BookmarkViewModelActions,
  BookmarkViewModelState,
};

export function useBookmarkViewModel(): BookmarkViewModel {
  const {
    findBookmark: findBookmarkHook,
    createBookmark: createBookmarkHook,
    updateBookmark: updateBookmarkHook,
    deleteBookmark: deleteBookmarkHook,
  } = useBookmark();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkList, setBookmarkList] = useState<BookmarkResponse | null>(
    null
  );
  const [criteria, setCriteria] = useState<BookmarkFilter>({
    page: 1,
    limit: 10,
    search: '',
  });

  const findBookmark = useCallback(
    async (newCriteria?: Partial<BookmarkFilter>) => {
      setIsLoading(true);
      setError(null);

      let criteriaToUse = criteria;

      if (newCriteria) {
        criteriaToUse = { ...criteria, ...newCriteria };
        setCriteria(criteriaToUse);
      }

      try {
        const result = await findBookmarkHook(criteriaToUse);
        if (result.success) {
          setBookmarkList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [findBookmarkHook, criteria]
  );

  const createBookmark = useCallback(
    async (data: BookmarkCreateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createBookmarkHook(data);
        if (result.success) {
          await findBookmark();
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
    [createBookmarkHook, findBookmark]
  );

  const updateBookmark = useCallback(
    async (data: BookmarkUpdateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateBookmarkHook(data);
        if (result.success) {
          await findBookmark();
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
    [updateBookmarkHook, findBookmark]
  );

  const deleteBookmark = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteBookmarkHook(id);
        if (result.success) {
          await findBookmark();
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
    [deleteBookmarkHook, findBookmark]
  );

  return {
    isLoading,
    error,
    bookmarkList,
    findBookmark,
    setCriteria,
    createBookmark,
    updateBookmark,
    deleteBookmark,
  };
}
