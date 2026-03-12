import {
  VerseRequest,
  VerseResponse,
  VerseCreateRequest,
  VerseUpdateRequest,
} from '@/application/dto';
import { useVerse } from '@/presentation/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  VerseViewModel,
  VerseViewModelActions,
  VerseViewModelState,
} from './VerseViewModel.types';
import { getErrorMessage } from '@/shared/utils';

export type { VerseViewModel, VerseViewModelActions, VerseViewModelState };

export function useVerseViewModel(): VerseViewModel {
  const {
    findVerse: findVerseHook,
    createVerse: createVerseHook,
    updateVerse: updateVerseHook,
    deleteVerse: deleteVerseHook,
    bulkDeleteVerse: bulkDeleteVerseHook,
  } = useVerse();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verseList, setVerseList] = useState<VerseResponse | null>(null);
  const [criteria, setCriteria] = useState<VerseRequest>({
    page: 1,
    limit: 10,
    search: '',
    chapterId: 0,
    arabicText: '',
    transliteration: '',
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Action
  const findVerse = useCallback(
    async (newCriteria?: Partial<VerseRequest>, options?: { silent?: boolean }) => {
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
        const result = await findVerseHook(criteriaToUse);
        if (!mountedRef.current) return;

        if (result.success) {
          setVerseList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
      } finally {
        if (mountedRef.current && !options?.silent) setIsLoading(false);
      }
    },
    [findVerseHook, criteria]
  );

  const fetchRef = useRef(findVerse);
  fetchRef.current = findVerse;

  const createVerse = useCallback(
    async (data: VerseCreateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createVerseHook(data);
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
    [createVerseHook]
  );

  const updateVerse = useCallback(
    async (data: VerseUpdateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateVerseHook(data);
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
    [updateVerseHook]
  );

  const deleteVerse = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteVerseHook(id);
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
    [deleteVerseHook]
  );

  const bulkDeleteVerse = useCallback(
    async (ids: number[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await bulkDeleteVerseHook(ids);
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
    [bulkDeleteVerseHook]
  );

  return {
    isLoading,
    error,
    verseList,
    findVerse,
    setCriteria,
    createVerse,
    updateVerse,
    deleteVerse,
    bulkDeleteVerse,
  };
}
