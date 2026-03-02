import { IBookmarkRepositoryPort } from '@/application/ports/repository/bookmark.repository.port';
import { failure, Result, success } from '@/core/types';
import {
  BookmarkCreateRequest,
  BookmarkUpdateRequest,
  BookmarkFilter,
  BookmarkResponse,
} from '@/application/dto/bookmark.dto';
import { BookmarkEntity } from '@/core/entities/bookmark.entity';
import { BookmarkMapper } from '@/infrastructure/mappers/bookmark.mapper';
import { ServerError } from '@/core/errors';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  BookmarkApiResponse,
  ListBookmarkApiResponse,
} from '@/infrastructure/models/bookmark.model';

export class BookmarkRepository implements IBookmarkRepositoryPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async find(criteria: BookmarkFilter): Promise<Result<BookmarkResponse>> {
    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('bookmarks')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .range(from, to)
      .order('id', { ascending: false });

    if (criteria.userId) {
      query = query.eq('user_id', criteria.userId);
    }

    const { data, error, count } = await query;

    if (error) return failure(new ServerError(error.message));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const apiResponse: ListBookmarkApiResponse = {
      data: (data ?? []) as BookmarkApiResponse[],
      meta: {
        total,
        total_pages: totalPages,
        page,
        limit,
        count: data?.length ?? 0,
      },
    };

    return success(BookmarkMapper.toDomainList(apiResponse));
  }

  async create(
    request: BookmarkCreateRequest
  ): Promise<Result<BookmarkEntity>> {
    const { data, error } = await this.supabase
      .from('bookmarks')
      .insert({ verse_id: request.verseId, note: request.note })
      .select()
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(BookmarkMapper.toDomain(data as BookmarkApiResponse));
  }

  async update(
    request: BookmarkUpdateRequest
  ): Promise<Result<BookmarkEntity>> {
    const { data, error } = await this.supabase
      .from('bookmarks')
      .update({ note: request.note })
      .eq('id', request.bookmarkId)
      .select()
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(BookmarkMapper.toDomain(data as BookmarkApiResponse));
  }

  async delete(id: number): Promise<Result<boolean>> {
    const { error } = await this.supabase
      .from('bookmarks')
      .delete()
      .eq('id', id);
    if (error) return failure(new ServerError(error.message));
    return success(true);
  }
}
