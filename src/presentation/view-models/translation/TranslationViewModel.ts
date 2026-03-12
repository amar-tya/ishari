import {
  TranslationRequest,
  TranslationResponse,
  TranslationCreateRequest,
  TranslationUpdateRequest,
} from '@/application/dto';
import { useTranslation } from '@/presentation/hooks';
import { VerseDropdown } from '@/core/entities';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  TranslationViewModel,
  TranslationViewModelActions,
  TranslationViewModelState,
} from './TranslationViewModel.types';
import { getErrorMessage } from '@/shared/utils';

export type {
  TranslationViewModel,
  TranslationViewModelActions,
  TranslationViewModelState,
};

export function useTranslationViewModel(): TranslationViewModel {
  const {
    findTranslation: findTranslationHook,
    createTranslation: createTranslationHook,
    updateTranslation: updateTranslationHook,
    deleteTranslation: deleteTranslationHook,
    bulkDeleteTranslation: bulkDeleteTranslationHook,
    getTranslationDropdown,
  } = useTranslation();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationList, setTranslationList] =
    useState<TranslationResponse | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState({
    verses: [] as VerseDropdown[],
    translators: [] as string[],
    languages: [] as string[],
  });
  const [criteria, setCriteria] = useState<TranslationRequest>({
    page: 1,
    limit: 10,
    search: '',
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Action
  const findTranslation = useCallback(
    async (newCriteria?: Partial<TranslationRequest>, options?: { silent?: boolean }) => {
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
        const result = await findTranslationHook(criteriaToUse);
        if (!mountedRef.current) return;

        if (result.success) {
          setTranslationList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
      } finally {
        if (mountedRef.current && !options?.silent) setIsLoading(false);
      }
    },
    [findTranslationHook, criteria]
  );

  const fetchRef = useRef(findTranslation);
  fetchRef.current = findTranslation;

  const createTranslation = useCallback(
    async (data: TranslationCreateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createTranslationHook(data);
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
    [createTranslationHook]
  );

  const updateTranslation = useCallback(
    async (data: TranslationUpdateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateTranslationHook(data);
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
    [updateTranslationHook]
  );

  const deleteTranslation = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteTranslationHook(id);
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
    [deleteTranslationHook]
  );

  const bulkDeleteTranslation = useCallback(
    async (ids: number[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await bulkDeleteTranslationHook(ids);
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
    [bulkDeleteTranslationHook]
  );

  const fetchDropdownOptions = useCallback(async () => {
    try {
      const result = await getTranslationDropdown();
      if (!mountedRef.current) return;

      if (result.success) {
        setDropdownOptions(result.data);
      } else {
        setError(getErrorMessage(result.error));
      }
    } catch (err) {
      if (mountedRef.current) setError(getErrorMessage(err));
    }
  }, [getTranslationDropdown]);

  return {
    isLoading,
    error,
    translationList,
    findTranslation,
    setCriteria,
    createTranslation,
    updateTranslation,
    deleteTranslation,
    bulkDeleteTranslation,
    dropdownOptions,
    fetchDropdownOptions,
  };
}
