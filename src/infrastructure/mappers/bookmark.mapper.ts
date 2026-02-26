import { BookmarkEntity } from '@/core/entities/bookmark.entity';
import {
  BookmarkApiResponse,
  ListBookmarkApiResponse,
} from '../models/bookmark.model';
import { BookmarkResponse } from '@/application/dto/bookmark.dto';

export class BookmarkMapper {
  static toDomain(response: BookmarkApiResponse): BookmarkEntity {
    return {
      id: response.id,
      userId: response.user_id,
      verseId: response.verse_id,
      note: response.note,
      createdAt: response.created_at,
      deletedAt: response.deleted_at || response.updated_at,
    };
  }

  static toDomainList(response: ListBookmarkApiResponse): BookmarkResponse {
    return {
      data: response.data.map(this.toDomain),
      meta: {
        total: response.meta.total,
        totalPages: response.meta.total_pages,
        page: response.meta.page,
        limit: response.meta.limit,
        count: response.meta.count,
      },
    };
  }
}
