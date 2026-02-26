import { IHadiRepository } from '../../ports';
import { Result } from '@/core/types';

export class DeleteHadiUseCase {
  constructor(private readonly repository: IHadiRepository) {}

  async execute(id: number): Promise<Result<void>> {
    return this.repository.delete(id);
  }
}
