import { IUserRepository } from '@/application/ports/repository/user.repository.port';
import { failure, Result, success } from '@/core/types';
import { UserApiResponse, ListUserApiResponse } from '../models/user.model';
import {
  UserCreateRequest,
  UserUpdateRequest,
  UserRequest,
} from '@/application/dto/user.dto';
import { UserEntity } from '@/core/entities';
import { PaginationResponse } from '@/application';
import { UserMapper } from '@/infrastructure/mappers/user.mapper';
import { ServerError } from '@/core/errors';
import { SupabaseClient } from '@supabase/supabase-js';

export class UserRepository implements IUserRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async find(
    criteria: UserRequest
  ): Promise<Result<{ data: UserEntity[]; meta: PaginationResponse }>> {
    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('users')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .range(from, to)
      .order('id', { ascending: false });

    if (criteria.search) {
      query = query.or(
        `username.ilike.%${criteria.search}%,email.ilike.%${criteria.search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) return failure(new ServerError(error.message));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const apiResponse: ListUserApiResponse = {
      data: (data ?? []) as UserApiResponse[],
      meta: {
        total,
        total_pages: totalPages,
        page,
        limit,
        count: data?.length ?? 0,
      },
    };

    return success(UserMapper.toResponse(apiResponse));
  }

  async create(request: UserCreateRequest): Promise<Result<UserEntity>> {
    const apiRequest = UserMapper.toCreateRequest(request);
    const { data, error } = await this.supabase
      .from('users')
      .insert(apiRequest)
      .select()
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(UserMapper.toDomain(data as UserApiResponse));
  }

  async update(request: UserUpdateRequest): Promise<Result<UserEntity>> {
    const apiRequest = UserMapper.toUpdateRequest(request);
    const { data, error } = await this.supabase
      .from('users')
      .update(apiRequest)
      .eq('id', request.id)
      .select()
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(UserMapper.toDomain(data as UserApiResponse));
  }

  async delete(id: number): Promise<Result<boolean>> {
    const { error } = await this.supabase.from('users').delete().eq('id', id);
    if (error) return failure(new ServerError(error.message));
    return success(true);
  }

  async bulkDelete(ids: number[]): Promise<Result<boolean>> {
    const { error } = await this.supabase.from('users').delete().in('id', ids);
    if (error) return failure(new ServerError(error.message));
    return success(true);
  }
}
