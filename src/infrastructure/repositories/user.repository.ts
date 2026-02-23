import { IUserRepository } from '@/application/ports/repository/user.repository.port';
import { ApiSuccessResponse, failure, Result, success } from '@/core/types';
import {
  UserCreateApiResponse,
  ListUserApiResponse,
  UserUpdateApiResponse,
  UserApiResponse,
} from '../models/user.model';
import {
  UserCreateRequest,
  UserUpdateRequest,
  UserRequest,
} from '@/application/dto/user.dto';
import { HttpClient } from '@/infrastructure/http';
import { UserEntity } from '@/core/entities';
import { PaginationResponse } from '@/application';
import { UserMapper } from '@/infrastructure/mappers/user.mapper';

export class UserRepository implements IUserRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async find(
    criteria: UserRequest
  ): Promise<Result<{ data: UserEntity[]; meta: PaginationResponse }>> {
    const queryParams = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const response = await this.httpClient.get<ListUserApiResponse>(
      `/users?${queryParams.toString()}`
    );

    if (!response.success) {
      return failure(response.error);
    }

    const resultData = UserMapper.toResponse(response.data.data);
    return success(resultData);
  }

  async create(request: UserCreateRequest): Promise<Result<UserEntity>> {
    const apiRequest = UserMapper.toCreateRequest(request);
    const result = await this.httpClient.post<
      ApiSuccessResponse<UserCreateApiResponse>
    >(`/users/register`, apiRequest);

    if (!result.success) {
      return failure(result.error);
    }

    // Usually post returns the created item. We'll map it to domain.
    const resultData = UserMapper.toDomain(
      result.data.data.data as unknown as UserApiResponse
    );
    return success(resultData);
  }

  async update(request: UserUpdateRequest): Promise<Result<UserEntity>> {
    const apiRequest = UserMapper.toUpdateRequest(request);
    const result = await this.httpClient.put<
      ApiSuccessResponse<UserUpdateApiResponse>
    >(`/users/${request.id}`, apiRequest);

    if (!result.success) {
      return failure(result.error);
    }

    const resultData = UserMapper.toDomain(
      result.data.data.data as unknown as UserApiResponse
    );
    return success(resultData);
  }

  async delete(id: number): Promise<Result<boolean>> {
    const result = await this.httpClient.delete<ApiSuccessResponse<void>>(
      `/users/${id}`
    );

    if (!result.success) {
      return failure(result.error);
    }

    return success(true);
  }

  async bulkDelete(ids: number[]): Promise<Result<boolean>> {
    const result = await this.httpClient.post<ApiSuccessResponse<void>>(
      `/users/bulk-delete`,
      { ids }
    );

    if (!result.success) {
      return failure(result.error);
    }

    return success(true);
  }
}
