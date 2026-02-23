import { BookMapper } from './book.mapper';
import {
  ChapterCreateRequest,
  ChapterUpdateRequest,
} from '@/application/dto/chapter.dto';
import { PaginationResponse } from '@/application/dto/pagination.dto';
import { BookEntity, ChapterEntity } from '@/core/entities';
import {
  ChaperApiMeta,
  ChapterApiResponse,
  ChapterCreateApiRequest,
  ChapterCreateApiResponse,
  ChapterUpdateApiRequest,
  ListChapterApiResponse,
} from '@/infrastructure/models';

export class ChapterMapper {
  static toDomain(apiData: ChapterApiResponse): ChapterEntity {
    return {
      id: Number(apiData.id),
      bookId: Number(apiData.book_id), // Map from book_id to bookId
      book: apiData.book
        ? BookMapper.toDomain(apiData.book)
        : ({} as BookEntity),
      chapterNumber: apiData.chapter_number, // Map from chapter_number to chapterNumber
      title: apiData.title,
      category: apiData.category,
      description: apiData.description,
      totalVerses: apiData.total_verses,
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
    };
  }

  static toDomain2(apiData: ChapterCreateApiResponse): ChapterEntity {
    return {
      id: Number(apiData.id),
      bookId: Number(apiData.book_id),
      book: apiData.book
        ? BookMapper.toDomain(apiData.book)
        : ({} as BookEntity),
      chapterNumber: Number(apiData.chapter_number),
      title: apiData.title,
      category: apiData.category,
      description: apiData.description || '',
      totalVerses: Number(apiData.total_verses),
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
    };
  }

  static toDomainList(apiDataList: ChapterApiResponse[]): ChapterEntity[] {
    return apiDataList.map((item) => ChapterMapper.toDomain(item));
  }

  static toMeta(apiMeta: ChaperApiMeta): PaginationResponse {
    return {
      total: apiMeta.total,
      totalPages: apiMeta.total_pages,
      page: apiMeta.page,
      limit: apiMeta.limit,
      count: apiMeta.count,
    };
  }

  static toCreateRequest(
    request: ChapterCreateRequest
  ): ChapterCreateApiRequest {
    return {
      book_id: Number(request.bookId),
      chapter_number: Number(request.chapterNumber),
      title: request.title,
      category: request.category,
      description: request.description,
      total_verses: Number(request.totalVerses),
    };
  }

  static toResponse(apiData: ListChapterApiResponse): {
    data: ChapterEntity[];
    meta: PaginationResponse;
  } {
    return {
      data: ChapterMapper.toDomainList(apiData.data),
      meta: ChapterMapper.toMeta(apiData.meta),
    };
  }

  static toUpdateRequest(
    request: ChapterUpdateRequest
  ): ChapterUpdateApiRequest {
    return {
      id: String(request.chapterId),
      book_id: Number(request.bookId),
      chapter_number: Number(request.chapterNumber),
      title: request.title!,
      category: request.category!,
      description: request.description,
      total_verses: Number(request.totalVerses),
    };
  }
}
