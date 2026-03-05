import {
  VerseCreateRequest,
  VerseUpdateRequest,
} from '@/application/dto/verse.dto';
import { PaginationResponse } from '@/application/dto/pagination.dto';
import { VerseEntity } from '@/core/entities';
import {
  ListVerseApiResponse,
  VerseApiMeta,
  VerseApiResponse,
  VerseCreateApiRequest,
  VerseUpdateApiRequest,
} from '@/infrastructure/models';
import { ChapterMapper } from './chapter.mapper';

export class VerseMapper {
  static toDomain(apiData: VerseApiResponse): VerseEntity {
    return {
      id: Number(apiData.id),
      chapterId: apiData.chapter_id,
      chapter: ChapterMapper.toDomain(apiData.chapter),
      verseNumber: apiData.verse_number,
      arabicText: apiData.arabic_text,
      transliteration: apiData.transliteration,
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
      verseMedia: apiData.verse_media
        ? apiData.verse_media.map((media) => ({
            id: media.id,
            mediaType: media.media_type,
            hadiId: media.hadi_id,
          }))
        : undefined,
    };
  }

  static toDomainList(apiDataList: VerseApiResponse[]): VerseEntity[] {
    return apiDataList.map((item) => VerseMapper.toDomain(item));
  }

  static toMeta(apiMeta: VerseApiMeta): PaginationResponse {
    return {
      total: apiMeta.total,
      totalPages: apiMeta.total_pages,
      page: apiMeta.page,
      limit: apiMeta.limit,
      count: apiMeta.count,
    };
  }

  static toCreateRequest(request: VerseCreateRequest): VerseCreateApiRequest {
    return {
      chapter_id: Number(request.chapterId),
      verse_number: Number(request.verseNumber),
      arabic_text: request.arabicText,
      transliteration: request.transliteration,
    };
  }

  static toUpdateRequest(request: VerseUpdateRequest): VerseUpdateApiRequest {
    return {
      chapter_id: request.chapterId ? Number(request.chapterId) : undefined,
      verse_number: request.verseNumber
        ? Number(request.verseNumber)
        : undefined,
      arabic_text: request.arabicText,
      transliteration: request.transliteration,
    };
  }

  static toResponse(apiData: ListVerseApiResponse): {
    data: VerseEntity[];
    meta: PaginationResponse;
  } {
    return {
      data: VerseMapper.toDomainList(apiData.data),
      meta: VerseMapper.toMeta(apiData.meta),
    };
  }
}
