import { ITranslationRepository } from '@/application/ports';
import { ApiSuccessResponse, failure, Result, success } from '@/core/types';
import {
  ListTranslationApiResponse,
  TranslationCreateApiResponse,
  TranslationUpdateApiResponse,
  TranslationDropdownApiResponse,
} from '../models';
import {
  TranslationCreateRequest,
  TranslationRequest,
  TranslationUpdateRequest,
} from '@/application/dto';
import { HttpClient } from '@/infrastructure/http';
import { TranslationEntity, VerseDropdown } from '@/core/entities';
import { PaginationResponse } from '@/application';
import { TranslationMapper } from '@/infrastructure/mappers';

export class TranslationRepository implements ITranslationRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async find(
    criteria: TranslationRequest
  ): Promise<Result<{ data: TranslationEntity[]; meta: PaginationResponse }>> {
    const queryParams = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const response = await this.httpClient.get<ListTranslationApiResponse>(
      `/translations?${queryParams.toString()}`
    );

    if (!response.success) {
      return failure(response.error);
    }

    const resultData = TranslationMapper.toResponse(response.data.data);

    return success(resultData);
  }

  async create(
    request: TranslationCreateRequest
  ): Promise<Result<TranslationEntity>> {
    const apiRequest = TranslationMapper.toCreateRequest(request);
    const result = await this.httpClient.post<
      ApiSuccessResponse<TranslationCreateApiResponse>
    >(`/translations`, apiRequest);

    if (!result.success) {
      return failure(result.error);
    }

    const resultData = TranslationMapper.toDomain(result.data.data.data);
    return success(resultData);
  }

  async update(
    request: TranslationUpdateRequest
  ): Promise<Result<TranslationEntity>> {
    const apiRequest = TranslationMapper.toUpdateRequest(request);
    const result = await this.httpClient.put<
      ApiSuccessResponse<TranslationUpdateApiResponse>
    >(`/translations/${request.translationId}`, apiRequest);

    if (!result.success) {
      return failure(result.error);
    }

    const resultData = TranslationMapper.toDomain(result.data.data.data);
    return success(resultData);
  }

  async delete(id: number): Promise<Result<boolean>> {
    const result = await this.httpClient.delete<ApiSuccessResponse<void>>(
      `/translations/${id}`
    );

    if (!result.success) {
      return failure(result.error);
    }

    return success(true);
  }

  async bulkDelete(ids: number[]): Promise<Result<boolean>> {
    const result = await this.httpClient.post<ApiSuccessResponse<void>>(
      `/translations/bulk-delete`,
      { ids }
    );

    if (!result.success) {
      return failure(result.error);
    }

    return success(true);
  }

  async getDataDropdown(): Promise<
    Result<{
      verses: VerseDropdown[];
      translators: string[];
      languages: string[];
    }>
  > {
    const result = await this.httpClient.get<
      ApiSuccessResponse<TranslationDropdownApiResponse>
    >(`/translations/dropdown`);

    if (!result.success) {
      return failure(result.error);
    }

    const { verses, translator_names, language_codes } = result.data.data.data;

    return success({
      verses: verses.map((v) => ({
        id: v.id,
        arabicText: v.arabic_text,
      })),
      translators: translator_names,
      languages: language_codes,
    });
  }
}
