import { IChapterMediaRepository } from '../../ports';
import { ListChapterMediaDTO } from '../../dto';
import { ChapterMediaEntityList } from '@/core/entities';
import { Result } from '@/core/types';

export class ListChapterMediaUseCase {
  constructor(private readonly repository: IChapterMediaRepository) {}

  async execute(
    dto: ListChapterMediaDTO
  ): Promise<Result<ChapterMediaEntityList>> {
    return this.repository.getAll(dto);
  }
}
