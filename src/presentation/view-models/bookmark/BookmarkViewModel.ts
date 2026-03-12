import {
  BookmarkCreateRequest,
  BookmarkFilter,
  BookmarkResponse,
  BookmarkUpdateRequest,
} from '@/application/dto';
import { useBookmark } from '@/presentation/hooks/useBookmark';
import { useCallback, useEffect, useRef, useState } from 'react';
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

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const findBookmark = useCallback(
    async (newCriteria?: Partial<BookmarkFilter>, options?: { silent?: boolean }) => {
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
        const result = await findBookmarkHook(criteriaToUse);
        if (!mountedRef.current) return;

        if (result.success) {
          setBookmarkList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
      } finally {
        if (mountedRef.current && !options?.silent) setIsLoading(false);
      }
    },
    [findBookmarkHook, criteria]
  );

  const fetchRef = useRef(findBookmark);
  fetchRef.current = findBookmark;

  const createBookmark = useCallback(
    async (data: BookmarkCreateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createBookmarkHook(data);
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
    [createBookmarkHook]
  );

  const updateBookmark = useCallback(
    async (data: BookmarkUpdateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateBookmarkHook(data);
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
    [updateBookmarkHook]
  );

  const deleteBookmark = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteBookmarkHook(id);
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
    [deleteBookmarkHook]
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
