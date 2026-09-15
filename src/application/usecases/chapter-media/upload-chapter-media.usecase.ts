import { IChapterMediaRepository } from '../../ports';
import { CreateChapterMediaDTO } from '../../dto';
import { ChapterMediaEntity } from '@/core/entities';
import { Result } from '@/core/types';

export class UploadChapterMediaUseCase {
  constructor(private readonly repository: IChapterMediaRepository) {}

  async execute(
    dto: CreateChapterMediaDTO
  ): Promise<Result<ChapterMediaEntity>> {
    return this.repository.upload(dto);
  }
}
