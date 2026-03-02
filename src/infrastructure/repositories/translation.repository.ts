import { ITranslationRepository } from '@/application/ports';
import { failure, Result, success } from '@/core/types';
import {
  TranslationCreateRequest,
  TranslationRequest,
  TranslationUpdateRequest,
} from '@/application/dto';
import { TranslationEntity, VerseDropdown } from '@/core/entities';
import { PaginationResponse } from '@/application';
import { TranslationMapper } from '@/infrastructure/mappers';
import { ServerError } from '@/core/errors';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  ListTranslationApiResponse,
  TranslationApiResponse,
} from '@/infrastructure/models';

export class TranslationRepository implements ITranslationRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async find(
    criteria: TranslationRequest
  ): Promise<Result<{ data: TranslationEntity[]; meta: PaginationResponse }>> {
    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('translations')
      .select(
        '*, verse:verses(id, arabic_text, verse_number, chapter:chapters(id, chapter_number, title))',
        { count: 'exact' }
      )
      .is('deleted_at', null)
      .range(from, to)
      .order('id', { ascending: false });

    if (criteria.search) {
      query = query.ilike('translation_text', `%${criteria.search}%`);
    }
    if (criteria.languageCode) {
      query = query.eq('language_code', criteria.languageCode);
    }
    if (criteria.translator) {
      query = query.eq('translator_name', criteria.translator);
    }
    if (criteria.verseId) {
      query = query.eq('verse_id', criteria.verseId);
    }

    const { data, error, count } = await query;

    if (error) return failure(new ServerError(error.message));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const apiResponse: ListTranslationApiResponse = {
      data: (data ?? []) as TranslationApiResponse[],
      meta: {
        total,
        total_pages: totalPages,
        page,
        limit,
        count: data?.length ?? 0,
      },
    };

    return success(TranslationMapper.toResponse(apiResponse));
  }

  async create(
    request: TranslationCreateRequest
  ): Promise<Result<TranslationEntity>> {
    const apiRequest = TranslationMapper.toCreateRequest(request);
    const { data, error } = await this.supabase
      .from('translations')
      .insert(apiRequest)
      .select(
        '*, verse:verses(id, arabic_text, verse_number, chapter:chapters(id, chapter_number, title))'
      )
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(TranslationMapper.toDomain(data as TranslationApiResponse));
  }

  async update(
    request: TranslationUpdateRequest
  ): Promise<Result<TranslationEntity>> {
    const apiRequest = TranslationMapper.toUpdateRequest(request);
    const { data, error } = await this.supabase
      .from('translations')
      .update(apiRequest)
      .eq('id', request.translationId)
      .select(
        '*, verse:verses(id, arabic_text, verse_number, chapter:chapters(id, chapter_number, title))'
      )
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(TranslationMapper.toDomain(data as TranslationApiResponse));
  }

  async delete(id: number): Promise<Result<boolean>> {
    const { error } = await this.supabase
      .from('translations')
      .delete()
      .eq('id', id);
    if (error) return failure(new ServerError(error.message));
    return success(true);
  }

  async bulkDelete(ids: number[]): Promise<Result<boolean>> {
    const { error } = await this.supabase
      .from('translations')
      .delete()
      .in('id', ids);
    if (error) return failure(new ServerError(error.message));
    return success(true);
  }

  async getDataDropdown(): Promise<
    Result<{
      verses: VerseDropdown[];
      translators: string[];
      languages: string[];
    }>
  > {
    const [versesResult, translationsResult] = await Promise.all([
      this.supabase
        .from('verses')
        .select('id, arabic_text')
        .is('deleted_at', null)
        .order('id'),
      this.supabase
        .from('translations')
        .select('translator_name, language_code')
        .is('deleted_at', null),
    ]);

    if (versesResult.error)
      return failure(new ServerError(versesResult.error.message));
    if (translationsResult.error)
      return failure(new ServerError(translationsResult.error.message));

    const verses: VerseDropdown[] = (versesResult.data ?? []).map((v) => ({
      id: v.id,
      arabicText: v.arabic_text,
    }));

    const translators = [
      ...new Set(
        (translationsResult.data ?? [])
          .map((t) => t.translator_name)
          .filter(Boolean)
      ),
    ];
    const languages = [
      ...new Set(
        (translationsResult.data ?? [])
          .map((t) => t.language_code)
          .filter(Boolean)
      ),
    ];

    return success({ verses, translators, languages });
  }
}
