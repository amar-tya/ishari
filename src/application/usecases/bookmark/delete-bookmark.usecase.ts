import { IBookmarkRepositoryPort } from '@/application/ports/repository/bookmark.repository.port';
import { Result } from '@/core/types';

export class DeleteBookmarkUseCase {
  private readonly bookmarkRepositoryPort: IBookmarkRepositoryPort;

  constructor(bookmarkRepositoryPort: IBookmarkRepositoryPort) {
    this.bookmarkRepositoryPort = bookmarkRepositoryPort;
  }

  async execute(id: number): Promise<Result<boolean>> {
    return this.bookmarkRepositoryPort.delete(id);
  }
}
