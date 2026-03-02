import {
  CreateHadiDTO,
  IHadiRepository,
  ListHadiDTO,
  UpdateHadiDTO,
} from '@/application';
import { HadiEntity, HadiEntityList } from '@/core/entities';
import { ServerError } from '@/core/errors';
import { failure, Result, success } from '@/core/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { HadiApiResponse, ListHadiApiResponse } from '@/infrastructure/models';
import { HadiMapper } from '@/infrastructure/mappers';

export class HadiRepository implements IHadiRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async create(dto: CreateHadiDTO): Promise<Result<HadiEntity>> {
    const { data, error } = await this.supabase
      .from('hadis')
      .insert({
        name: dto.name,
        description: dto.description ?? null,
        image_url: dto.image_url ?? null,
      })
      .select()
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(HadiMapper.toDomain(data as HadiApiResponse));
  }

  async update(id: number, dto: UpdateHadiDTO): Promise<Result<HadiEntity>> {
    const { data, error } = await this.supabase
      .from('hadis')
      .update({
        name: dto.name,
        description: dto.description ?? null,
        image_url: dto.image_url ?? null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(HadiMapper.toDomain(data as HadiApiResponse));
  }

  async delete(id: number): Promise<Result<void>> {
    const { error } = await this.supabase.from('hadis').delete().eq('id', id);
    if (error) return failure(new ServerError(error.message));
    return success(undefined);
  }

  async getById(id: number): Promise<Result<HadiEntity>> {
    const { data, error } = await this.supabase
      .from('hadis')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(HadiMapper.toDomain(data as HadiApiResponse));
  }

  async getAll(dto: ListHadiDTO): Promise<Result<HadiEntityList>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('hadis')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .range(from, to)
      .order('id', { ascending: false });

    if (dto.search) {
      query = query.ilike('name', `%${dto.search}%`);
    }

    const { data, error, count } = await query;

    if (error) return failure(new ServerError(error.message));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const apiResponse: ListHadiApiResponse = {
      data: (data ?? []) as HadiApiResponse[],
      meta: {
        total,
        total_pages: totalPages,
        page,
        limit,
        count: data?.length ?? 0,
      },
    };

    return success(HadiMapper.toEntityList(apiResponse));
  }
}
