import { IHadiRepository } from '../../ports';
import { ListHadiDTO } from '../../dto';
import { HadiEntityList } from '@/core/entities';
import { Result } from '@/core/types';

export class ListHadiUseCase {
  constructor(private readonly repository: IHadiRepository) {}

  async execute(dto: ListHadiDTO): Promise<Result<HadiEntityList>> {
    return this.repository.getAll(dto);
  }
}
