import { VerseMediaEntity, VerseMediaEntityList } from '@/core/entities';
import { Result } from '@/core/types';
import {
  CreateVerseMediaDTO,
  ListVerseMediaDTO,
  UpdateVerseMediaDTO,
} from '@/application/dto';

export interface IVerseMediaRepository {
  upload(dto: CreateVerseMediaDTO): Promise<Result<VerseMediaEntity>>;
  update(
    id: number,
    dto: UpdateVerseMediaDTO
  ): Promise<Result<VerseMediaEntity>>;
  delete(id: number, storagePath: string): Promise<Result<void>>;
  getById(id: number): Promise<Result<VerseMediaEntity>>;
  getAll(dto: ListVerseMediaDTO): Promise<Result<VerseMediaEntityList>>;
  getRandomWithAudio(): Promise<Result<VerseMediaEntity>>;
}
