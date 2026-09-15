import { ChapterMediaEntity, ChapterMediaEntityList } from '@/core/entities';
import { Result } from '@/core/types';
import {
  CreateChapterMediaDTO,
  ListChapterMediaDTO,
  UpdateChapterMediaDTO,
} from '@/application/dto';

export interface IChapterMediaRepository {
  upload(dto: CreateChapterMediaDTO): Promise<Result<ChapterMediaEntity>>;
  update(
    id: number,
    dto: UpdateChapterMediaDTO
  ): Promise<Result<ChapterMediaEntity>>;
  delete(id: number, storagePath: string): Promise<Result<void>>;
  getById(id: number): Promise<Result<ChapterMediaEntity>>;
  getAll(dto: ListChapterMediaDTO): Promise<Result<ChapterMediaEntityList>>;
}
