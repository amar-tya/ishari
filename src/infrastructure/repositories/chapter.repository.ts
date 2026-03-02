import {
  ChapterCreateRequest,
  ChapterRequest,
  ChapterUpdateRequest,
} from '@/application/dto/chapter.dto';
import { IChapterRepository } from '@/application/ports/repository/chapter.repository.port';
import { failure, Result, success } from '@/core/types';
import { ChapterEntity } from '@/core/entities';
import { PaginationResponse } from '@/application/dto/pagination.dto';
import { ChapterMapper } from '@/infrastructure/mappers';
import { ServerError } from '@/core/errors';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  ChapterApiResponse,
  ListChapterApiResponse,
} from '@/infrastructure/models';

export class ChapterRepository implements IChapterRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findChapter(
    criteria: ChapterRequest
  ): Promise<Result<{ data: ChapterEntity[]; meta: PaginationResponse }>> {
    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('chapters')
      .select('*, book:books(*)', { count: 'exact' })
      .is('deleted_at', null)
      .range(from, to)
      .order('chapter_number', { ascending: true });

    if (criteria.search) {
      query = query.or(
        `title.ilike.%${criteria.search}%,name.ilike.%${criteria.search}%`
      );
    }
    if (criteria.bookId) {
      query = query.eq('book_id', criteria.bookId);
    }
    if (criteria.category) {
      // Support multiple categories (comma-separated)
      const cats = String(criteria.category).split(',').filter(Boolean);
      if (cats.length === 1) {
        query = query.eq('category', cats[0]);
      } else if (cats.length > 1) {
        query = query.in('category', cats);
      }
    }

    const { data, error, count } = await query;

    if (error) return failure(new ServerError(error.message));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const apiResponse: ListChapterApiResponse = {
      data: (data ?? []) as ChapterApiResponse[],
      meta: {
        total,
        total_pages: totalPages,
        page,
        limit,
        count: data?.length ?? 0,
      },
    };

    const resultData = ChapterMapper.toResponse(apiResponse);
    return success({ data: resultData.data, meta: resultData.meta });
  }

  async create(request: ChapterCreateRequest): Promise<Result<ChapterEntity>> {
    const apiRequest = ChapterMapper.toCreateRequest(request);
    const { data, error } = await this.supabase
      .from('chapters')
      .insert(apiRequest)
      .select('*, book:books(*)')
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(ChapterMapper.toDomain(data as ChapterApiResponse));
  }

  async update(request: ChapterUpdateRequest): Promise<Result<ChapterEntity>> {
    const apiRequest = ChapterMapper.toUpdateRequest(request);
    const { data, error } = await this.supabase
      .from('chapters')
      .update(apiRequest)
      .eq('id', request.chapterId)
      .select('*, book:books(*)')
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(ChapterMapper.toDomain(data as ChapterApiResponse));
  }

  async delete(id: number): Promise<Result<boolean>> {
    const { error } = await this.supabase
      .from('chapters')
      .delete()
      .eq('id', id);

    if (error) return failure(new ServerError(error.message));
    return success(true);
  }

  async bulkDelete(ids: number[]): Promise<Result<boolean>> {
    const { error } = await this.supabase
      .from('chapters')
      .delete()
      .in('id', ids);

    if (error) return failure(new ServerError(error.message));
    return success(true);
  }
}
