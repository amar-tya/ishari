import {
  BookmarkFilter,
  BookmarkResponse,
} from '@/application/dto/bookmark.dto';
import { IBookmarkRepositoryPort } from '@/application/ports/repository/bookmark.repository.port';
import { mapResult, Result } from '@/core/types';

export class FindBookmarkUseCase {
  private readonly bookmarkRepositoryPort: IBookmarkRepositoryPort;

  constructor(bookmarkRepositoryPort: IBookmarkRepositoryPort) {
    this.bookmarkRepositoryPort = bookmarkRepositoryPort;
  }

  async execute(criteria: BookmarkFilter): Promise<Result<BookmarkResponse>> {
    const result = await this.bookmarkRepositoryPort.find(criteria);

    return mapResult(result, (res) => ({
      data: res.data,
      meta: res.meta,
    }));
  }
}
