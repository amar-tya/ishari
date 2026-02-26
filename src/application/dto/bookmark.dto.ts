import { BookmarkEntity } from '@/core/entities/bookmark.entity';
import { PaginationResponse } from './pagination.dto';

export interface BookmarkFilter {
  page: number;
  limit?: number;
  search?: string;
  userId?: number;
}

export interface BookmarkResponse {
  data: BookmarkEntity[];
  meta: PaginationResponse;
}

export interface BookmarkCreateRequest {
  verseId: number;
  note: string;
}

export interface BookmarkUpdateRequest {
  bookmarkId: number;
  note: string;
}
