import {
  CreateHadiDTO,
  IHadiRepository,
  ListHadiDTO,
  UpdateHadiDTO,
} from '@/application';
import { HadiEntity, HadiEntityList } from '@/core/entities';
import { ServerError } from '@/core/errors';
import { ApiSuccessResponse, failure, Result, success } from '@/core/types';
import { HttpClient } from '@/infrastructure/http';
import { HadiApiResponse, ListHadiApiResponse } from '@/infrastructure/models';
import { HadiMapper } from '@/infrastructure/mappers';

export class HadiRepository implements IHadiRepository {
  constructor(private readonly httpClient: HttpClient) {}

  // POST /hadis
  async create(dto: CreateHadiDTO): Promise<Result<HadiEntity>> {
    const result = await this.httpClient.post<
      ApiSuccessResponse<HadiApiResponse>
    >('/hadis', dto);

    if (!result.success) {
      return failure(result.error);
    }

    const apiResponse = result.data.data.data;

    if (apiResponse && typeof apiResponse === 'object' && 'id' in apiResponse) {
      return success(HadiMapper.toDomain(apiResponse));
    }

    return failure(new ServerError('Unexpected response format'));
  }

  // PUT /hadis/{id}
  async update(id: number, dto: UpdateHadiDTO): Promise<Result<HadiEntity>> {
    const result = await this.httpClient.put<
      ApiSuccessResponse<HadiApiResponse>
    >(`/hadis/${id}`, dto);

    if (!result.success) {
      return failure(result.error);
    }

    const apiResponse = result.data.data.data;

    if (apiResponse && typeof apiResponse === 'object' && 'id' in apiResponse) {
      return success(HadiMapper.toDomain(apiResponse));
    }

    return failure(new ServerError('Unexpected response format'));
  }

  // DELETE /hadis/{id}
  async delete(id: number): Promise<Result<void>> {
    const result = await this.httpClient.delete<ApiSuccessResponse<void>>(
      `/hadis/${id}`
    );

    if (!result.success) {
      return failure(result.error);
    }

    return success(undefined);
  }

  // GET /hadis/{id}
  async getById(id: number): Promise<Result<HadiEntity>> {
    const result = await this.httpClient.get<
      ApiSuccessResponse<HadiApiResponse>
    >(`/hadis/${id}`);

    if (!result.success) {
      return failure(result.error);
    }

    const apiResponse = result.data.data.data;

    if (apiResponse && typeof apiResponse === 'object' && 'id' in apiResponse) {
      return success(HadiMapper.toDomain(apiResponse));
    }

    return failure(new ServerError('Unexpected response format'));
  }

  // GET /hadis?page=&limit=&search=
  async getAll(dto: ListHadiDTO): Promise<Result<HadiEntityList>> {
    const params = new URLSearchParams();
    params.append('page', dto.page.toString());
    if (dto.limit) params.append('limit', dto.limit.toString());
    if (dto.search) params.append('search', dto.search);

    const result = await this.httpClient.get<ListHadiApiResponse>(
      `/hadis?${params.toString()}`
    );

    if (!result.success) {
      return failure(result.error);
    }

    const apiResponse = result.data.data;

    if (apiResponse && Array.isArray(apiResponse.data) && apiResponse.meta) {
      return success(HadiMapper.toEntityList(apiResponse));
    }

    return failure(new ServerError('Unexpected response format'));
  }
}
