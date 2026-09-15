import { IChapterMediaRepository } from '../../ports';
import { ChapterMediaEntity } from '@/core/entities';
import { Result } from '@/core/types';

export class FindChapterMediaUseCase {
  constructor(private readonly repository: IChapterMediaRepository) {}

  async execute(id: number): Promise<Result<ChapterMediaEntity>> {
    return this.repository.getById(id);
  }
}
