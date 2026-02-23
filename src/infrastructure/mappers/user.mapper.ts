import {
  UserCreateRequest,
  UserUpdateRequest,
} from '@/application/dto/user.dto';
import { PaginationResponse } from '@/application/dto/pagination.dto';
import { UserEntity } from '@/core/entities';
import {
  ListUserApiResponse,
  UserApiMeta,
  UserApiResponse,
  UserCreateApiResponse,
  UserUpdateApiResponse,
} from '@/infrastructure/models/user.model';

export class UserMapper {
  static toDomain(apiData: UserApiResponse): UserEntity {
    return {
      id: Number(apiData.id),
      username: apiData.username,
      email: apiData.email,
      isActive: apiData.is_active,
      lastLoginAt: apiData.last_login_at,
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
    };
  }

  static toDomainList(apiDataList: UserApiResponse[]): UserEntity[] {
    return apiDataList.map((item) => UserMapper.toDomain(item));
  }

  static toMeta(apiMeta: UserApiMeta): PaginationResponse {
    return {
      total: apiMeta.total,
      totalPages: apiMeta.total_pages,
      page: apiMeta.page,
      limit: apiMeta.limit,
      count: apiMeta.count,
    };
  }

  static toCreateRequest(request: UserCreateRequest): UserCreateApiResponse {
    return {
      username: request.username,
      email: request.email,
      password: request.password,
    };
  }

  static toUpdateRequest(request: UserUpdateRequest): UserUpdateApiResponse {
    return {
      id: request.id,
      username: request.username,
      email: request.email,
      is_active: request.isActive,
    };
  }

  static toResponse(apiData: ListUserApiResponse): {
    data: UserEntity[];
    meta: PaginationResponse;
  } {
    return {
      data: UserMapper.toDomainList(apiData.data),
      meta: UserMapper.toMeta(apiData.meta),
    };
  }
}
