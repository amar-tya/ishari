import {
  TranslationCreateRequest,
  TranslationRequest,
  TranslationResponse,
  TranslationUpdateRequest,
} from '@/application/dto/translation.dto';
import { TranslationEntity, verseTranslation } from '@/core/entities';
import { Result } from '@/core/types';
import { container } from '@/di';
import { useCallback } from 'react';

export interface UseTranslation {
  findTranslation: (
    criteria: TranslationRequest
  ) => Promise<Result<TranslationResponse>>;
  createTranslation: (
    request: TranslationCreateRequest
  ) => Promise<Result<TranslationEntity>>;
  updateTranslation: (
    request: TranslationUpdateRequest
  ) => Promise<Result<TranslationEntity>>;
  deleteTranslation: (id: number) => Promise<Result<boolean>>;
  bulkDeleteTranslation: (ids: number[]) => Promise<Result<boolean>>;
  getTranslationDropdown: () => Promise<
    Result<{
      verses: verseTranslation[];
      translators: string[];
      languages: string[];
    }>
  >;
}

export function useTranslation(): UseTranslation {
  const {
    findTranslationUseCase,
    createTranslationUseCase,
    updateTranslationUseCase,
    deleteTranslationUseCase,
    bulkDeleteTranslationUseCase,
    getTranslationDropdownUseCase,
  } = container;

  const findTranslation = useCallback(
    async (
      criteria: TranslationRequest
    ): Promise<Result<TranslationResponse>> => {
      const result = await findTranslationUseCase.execute(criteria);
      return result;
    },
    [findTranslationUseCase]
  );

  const createTranslation = useCallback(
    async (
      request: TranslationCreateRequest
    ): Promise<Result<TranslationEntity>> => {
      const result = await createTranslationUseCase.execute(request);
      return result;
    },
    [createTranslationUseCase]
  );

  const updateTranslation = useCallback(
    async (
      request: TranslationUpdateRequest
    ): Promise<Result<TranslationEntity>> => {
      const result = await updateTranslationUseCase.execute(request);
      return result;
    },
    [updateTranslationUseCase]
  );

  const deleteTranslation = useCallback(
    async (id: number): Promise<Result<boolean>> => {
      const result = await deleteTranslationUseCase.execute(id);
      return result;
    },
    [deleteTranslationUseCase]
  );

  const bulkDeleteTranslation = useCallback(
    async (ids: number[]): Promise<Result<boolean>> => {
      const result = await bulkDeleteTranslationUseCase.execute(ids);
      return result;
    },
    [bulkDeleteTranslationUseCase]
  );

  const getTranslationDropdown = useCallback(async (): Promise<
    Result<{
      verses: verseTranslation[];
      translators: string[];
      languages: string[];
    }>
  > => {
    const result = await getTranslationDropdownUseCase.execute();
    return result;
  }, [getTranslationDropdownUseCase]);

  return {
    findTranslation,
    createTranslation,
    updateTranslation,
    deleteTranslation,
    bulkDeleteTranslation,
    getTranslationDropdown,
  };
}
