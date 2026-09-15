import { IChapterMediaRepository } from '../../ports';
import { UpdateChapterMediaDTO } from '../../dto';
import { ChapterMediaEntity } from '@/core/entities';
import { Result } from '@/core/types';

export class UpdateChapterMediaUseCase {
  constructor(private readonly repository: IChapterMediaRepository) {}

  async execute(
    id: number,
    dto: UpdateChapterMediaDTO
  ): Promise<Result<ChapterMediaEntity>> {
    return this.repository.update(id, dto);
  }
}
