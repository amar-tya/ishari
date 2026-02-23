import {
  UserCreateRequest,
  UserRequest,
  UserResponse,
  UserUpdateRequest,
} from '@/application/dto/user.dto';
import { UserEntity } from '@/core/entities/user.entity';
import { Result } from '@/core/types';

export interface IUserRepository {
  find(criteria: UserRequest): Promise<Result<UserResponse>>;
  create(request: UserCreateRequest): Promise<Result<UserEntity>>;
  update(request: UserUpdateRequest): Promise<Result<UserEntity>>;
  delete(id: number): Promise<Result<boolean>>;
  bulkDelete(ids: number[]): Promise<Result<boolean>>;
}
