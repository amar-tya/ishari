import { IBookmarkRepositoryPort } from '@/application/ports/repository/bookmark.repository.port';
import { BookmarkUpdateRequest } from '@/application/dto/bookmark.dto';
import { Result } from '@/core/types';
import { BookmarkEntity } from '@/core/entities/bookmark.entity';

export class UpdateBookmarkUseCase {
  private readonly bookmarkRepositoryPort: IBookmarkRepositoryPort;

  constructor(bookmarkRepositoryPort: IBookmarkRepositoryPort) {
    this.bookmarkRepositoryPort = bookmarkRepositoryPort;
  }

  async execute(
    request: BookmarkUpdateRequest
  ): Promise<Result<BookmarkEntity>> {
    return this.bookmarkRepositoryPort.update(request);
  }
}
