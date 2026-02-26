import { IBookmarkRepositoryPort } from '@/application/ports/repository/bookmark.repository.port';
import { BookmarkCreateRequest } from '@/application/dto/bookmark.dto';
import { Result } from '@/core/types';
import { BookmarkEntity } from '@/core/entities/bookmark.entity';

export class CreateBookmarkUseCase {
  private readonly bookmarkRepositoryPort: IBookmarkRepositoryPort;

  constructor(bookmarkRepositoryPort: IBookmarkRepositoryPort) {
    this.bookmarkRepositoryPort = bookmarkRepositoryPort;
  }

  async execute(
    request: BookmarkCreateRequest
  ): Promise<Result<BookmarkEntity>> {
    return this.bookmarkRepositoryPort.create(request);
  }
}
