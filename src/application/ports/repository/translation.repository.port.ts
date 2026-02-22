import {
  PaginationResponse,
  TranslationCreateRequest,
  TranslationRequest,
  TranslationUpdateRequest,
} from '@/application/dto';
import { TranslationEntity, VerseDropdown } from '@/core/entities';
import { Result } from '@/core/types';

export interface ITranslationRepository {
  find(
    criteria: TranslationRequest
  ): Promise<Result<{ data: TranslationEntity[]; meta: PaginationResponse }>>;
  create(request: TranslationCreateRequest): Promise<Result<TranslationEntity>>;
  update(request: TranslationUpdateRequest): Promise<Result<TranslationEntity>>;
  delete(id: number): Promise<Result<boolean>>;
  bulkDelete(ids: number[]): Promise<Result<boolean>>;
  getDataDropdown(): Promise<
    Result<{
      verses: VerseDropdown[];
      translators: string[];
      languages: string[];
    }>
  >;
}
