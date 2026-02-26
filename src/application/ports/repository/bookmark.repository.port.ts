import {
  BookmarkCreateRequest,
  BookmarkFilter,
  BookmarkResponse,
  BookmarkUpdateRequest,
} from '@/application/dto/bookmark.dto';
import { BookmarkEntity } from '@/core/entities/bookmark.entity';
import { Result } from '@/core/types';

export interface IBookmarkRepositoryPort {
  create(request: BookmarkCreateRequest): Promise<Result<BookmarkEntity>>;
  update(request: BookmarkUpdateRequest): Promise<Result<BookmarkEntity>>;
  delete(id: number): Promise<Result<boolean>>;
  find(criteria: BookmarkFilter): Promise<Result<BookmarkResponse>>;
}
