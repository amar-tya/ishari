import { IUserRepository } from '@/application/ports/repository/user.repository.port';
import { Result } from '@/core/types';

export class BulkDeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(ids: number[]): Promise<Result<boolean>> {
    return this.userRepository.bulkDelete(ids);
  }
}
