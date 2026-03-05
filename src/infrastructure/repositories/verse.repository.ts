import { IVerseRepositoryPort } from '@/application/ports';
import { failure, Result, success } from '@/core/types';
import {
  VerseCreateRequest,
  VerseUpdateRequest,
  VerseRequest,
} from '@/application/dto/verse.dto';
import { VerseEntity } from '@/core/entities';
import { PaginationResponse } from '@/application';
import { VerseMapper } from '@/infrastructure/mappers';
import { ServerError } from '@/core/errors';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  ListVerseApiResponse,
  VerseApiResponse,
} from '@/infrastructure/models';

export class VerseRepository implements IVerseRepositoryPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async find(
    criteria: VerseRequest
  ): Promise<Result<{ data: VerseEntity[]; meta: PaginationResponse }>> {
    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('verses')
      .select(
        '*, chapter:chapters(*, book:books(*)), verse_media(id, media_type, hadi_id)',
        { count: 'exact' }
      )
      .is('deleted_at', null)
      .range(from, to)
      .order('verse_number', { ascending: true });

    if (criteria.chapterId) {
      query = query.eq('chapter_id', criteria.chapterId);
    }
    if (criteria.search) {
      query = query.or(
        `arabic_text.ilike.%${criteria.search}%,transliteration.ilike.%${criteria.search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) return failure(new ServerError(error.message));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const apiResponse: ListVerseApiResponse = {
      data: (data ?? []) as VerseApiResponse[],
      meta: {
        total,
        total_pages: totalPages,
        page,
        limit,
        count: data?.length ?? 0,
      },
    };

    return success(VerseMapper.toResponse(apiResponse));
  }

  async create(request: VerseCreateRequest): Promise<Result<VerseEntity>> {
    const apiRequest = VerseMapper.toCreateRequest(request);
    const { data, error } = await this.supabase
      .from('verses')
      .insert(apiRequest)
      .select(
        '*, chapter:chapters(*, book:books(*)), verse_media(id, media_type, hadi_id)'
      )
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(VerseMapper.toDomain(data as VerseApiResponse));
  }

  async update(request: VerseUpdateRequest): Promise<Result<VerseEntity>> {
    const apiRequest = VerseMapper.toUpdateRequest(request);
    const { data, error } = await this.supabase
      .from('verses')
      .update(apiRequest)
      .eq('id', request.verseId)
      .select(
        '*, chapter:chapters(*, book:books(*)), verse_media(id, media_type, hadi_id)'
      )
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(VerseMapper.toDomain(data as VerseApiResponse));
  }

  async delete(id: number): Promise<Result<boolean>> {
    const { error } = await this.supabase.from('verses').delete().eq('id', id);

    if (error) return failure(new ServerError(error.message));
    return success(true);
  }

  async bulkDelete(ids: number[]): Promise<Result<boolean>> {
    const { error } = await this.supabase.from('verses').delete().in('id', ids);

    if (error) return failure(new ServerError(error.message));
    return success(true);
  }
}
