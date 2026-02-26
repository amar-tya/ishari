import { IHadiRepository } from '../../ports';
import { HadiEntity } from '@/core/entities';
import { Result } from '@/core/types';

export class FindHadiUseCase {
  constructor(private readonly repository: IHadiRepository) {}

  async execute(id: number): Promise<Result<HadiEntity>> {
    return this.repository.getById(id);
  }
}
