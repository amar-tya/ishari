import {
  CreateBookDTO,
  IBookRepository,
  ListBookDTO,
  UpdateBookDTO,
} from '@/application';
import { BookEntity, BookEntityList } from '@/core/entities';
import { ServerError } from '@/core/errors';
import { failure, Result, success } from '@/core/types';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  BookMapper,
  BookApiResponse,
  ListBookApiResponse,
} from '@/infrastructure/mappers';

export class BookRepository implements IBookRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async create(dto: CreateBookDTO): Promise<Result<BookEntity>> {
    const { data, error } = await this.supabase
      .from('books')
      .insert({
        title: dto.title,
        author: dto.author ?? null,
        description: dto.description ?? null,
        published_year: dto.published_year ?? null,
        cover_image_url: dto.cover_image_url ?? null,
      })
      .select()
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(BookMapper.toDomain(data as BookApiResponse));
  }

  async update(id: number, dto: UpdateBookDTO): Promise<Result<BookEntity>> {
    const { data, error } = await this.supabase
      .from('books')
      .update({
        title: dto.title,
        author: dto.author ?? null,
        description: dto.description ?? null,
        published_year: dto.published_year ?? null,
        cover_image_url: dto.cover_image_url ?? null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(BookMapper.toDomain(data as BookApiResponse));
  }

  async delete(id: number): Promise<Result<void>> {
    const { error } = await this.supabase.from('books').delete().eq('id', id);

    if (error) return failure(new ServerError(error.message));
    return success(undefined);
  }

  async getById(id: number): Promise<Result<BookEntity>> {
    const { data, error } = await this.supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(BookMapper.toDomain(data as BookApiResponse));
  }

  async getAll(dto: ListBookDTO): Promise<Result<BookEntityList>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('books')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('id', { ascending: false });

    if (dto.search) {
      query = query.or(
        `title.ilike.%${dto.search}%,author.ilike.%${dto.search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) return failure(new ServerError(error.message));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const apiResponse: ListBookApiResponse = {
      data: (data ?? []) as BookApiResponse[],
      meta: {
        total,
        total_pages: totalPages,
        page,
        limit,
        count: data?.length ?? 0,
      },
    };

    return success(BookMapper.toEntityList(apiResponse));
  }
}
