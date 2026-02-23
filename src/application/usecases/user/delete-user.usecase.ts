import { IUserRepository } from '@/application/ports/repository/user.repository.port';
import { Result } from '@/core/types';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<Result<boolean>> {
    return this.userRepository.delete(id);
  }
}
