import { IUserRepository } from '@/application/ports/repository/user.repository.port';
import { UserUpdateRequest } from '@/application/dto/user.dto';
import { UserEntity } from '@/core/entities';
import { Result } from '@/core/types';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: UserUpdateRequest): Promise<Result<UserEntity>> {
    return this.userRepository.update(request);
  }
}
