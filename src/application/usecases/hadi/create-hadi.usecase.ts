import { IHadiRepository } from '../../ports';
import { CreateHadiDTO } from '../../dto';
import { HadiEntity } from '@/core/entities';
import { Result } from '@/core/types';

export class CreateHadiUseCase {
  constructor(private readonly repository: IHadiRepository) {}

  async execute(dto: CreateHadiDTO): Promise<Result<HadiEntity>> {
    return this.repository.create(dto);
  }
}
