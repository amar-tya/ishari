import { IUserRepository } from '@/application/ports/repository/user.repository.port';
import { UserCreateRequest } from '@/application/dto/user.dto';
import { UserEntity } from '@/core/entities';
import { Result } from '@/core/types';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: UserCreateRequest): Promise<Result<UserEntity>> {
    return this.userRepository.create(request);
  }
}
