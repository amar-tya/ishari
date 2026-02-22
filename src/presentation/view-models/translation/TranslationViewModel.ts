import {
  TranslationRequest,
  TranslationResponse,
  TranslationCreateRequest,
  TranslationUpdateRequest,
} from '@/application/dto';
import { useTranslation } from '@/presentation/hooks';
import { VerseDropdown } from '@/core/entities';
import { useCallback, useState } from 'react';
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

  // Action
  const findTranslation = useCallback(
    async (newCriteria?: Partial<TranslationRequest>) => {
      setIsLoading(true);
      setError(null);

      let criteriaToUse = criteria;

      if (newCriteria) {
        criteriaToUse = { ...criteria, ...newCriteria };
        setCriteria(criteriaToUse);
      }

      try {
        const result = await findTranslationHook(criteriaToUse);
        if (result.success) {
          setTranslationList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [findTranslationHook, criteria]
  );

  const createTranslation = useCallback(
    async (data: TranslationCreateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createTranslationHook(data);
        if (result.success) {
          await findTranslation();
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
    [createTranslationHook, findTranslation]
  );

  const updateTranslation = useCallback(
    async (data: TranslationUpdateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateTranslationHook(data);
        if (result.success) {
          await findTranslation();
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
    [updateTranslationHook, findTranslation]
  );

  const deleteTranslation = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteTranslationHook(id);
        if (result.success) {
          await findTranslation();
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
    [deleteTranslationHook, findTranslation]
  );

  const bulkDeleteTranslation = useCallback(
    async (ids: number[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await bulkDeleteTranslationHook(ids);
        if (result.success) {
          await findTranslation();
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
    [bulkDeleteTranslationHook, findTranslation]
  );

  const fetchDropdownOptions = useCallback(async () => {
    try {
      const result = await getTranslationDropdown();
      if (result.success) {
        setDropdownOptions(result.data);
      } else {
        setError(getErrorMessage(result.error));
      }
    } catch (err) {
      setError(getErrorMessage(err));
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
