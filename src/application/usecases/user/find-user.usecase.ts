import { IUserRepository } from '@/application/ports/repository/user.repository.port';
import { UserRequest, UserResponse } from '@/application/dto/user.dto';
import { Result } from '@/core/types';

export class FindUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(criteria: UserRequest): Promise<Result<UserResponse>> {
    return this.userRepository.find(criteria);
  }
}
