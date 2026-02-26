import { HadiEntity, HadiEntityList } from '@/core/entities';
import { Result } from '@/core/types';
import { CreateHadiDTO, ListHadiDTO, UpdateHadiDTO } from '@/application/dto';

export interface IHadiRepository {
  create(dto: CreateHadiDTO): Promise<Result<HadiEntity>>;
  update(id: number, dto: UpdateHadiDTO): Promise<Result<HadiEntity>>;
  delete(id: number): Promise<Result<void>>;
  getById(id: number): Promise<Result<HadiEntity>>;
  getAll(dto: ListHadiDTO): Promise<Result<HadiEntityList>>;
}
