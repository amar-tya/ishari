import { IHadiRepository } from '../../ports';
import { UpdateHadiDTO } from '../../dto';
import { HadiEntity } from '@/core/entities';
import { Result } from '@/core/types';

export class UpdateHadiUseCase {
  constructor(private readonly repository: IHadiRepository) {}

  async execute(id: number, dto: UpdateHadiDTO): Promise<Result<HadiEntity>> {
    return this.repository.update(id, dto);
  }
}
