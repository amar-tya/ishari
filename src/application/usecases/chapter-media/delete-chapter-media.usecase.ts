import { IChapterMediaRepository } from '../../ports';
import { Result } from '@/core/types';

export class DeleteChapterMediaUseCase {
  constructor(private readonly repository: IChapterMediaRepository) {}

  async execute(id: number, storagePath: string): Promise<Result<void>> {
    return this.repository.delete(id, storagePath);
  }
}
