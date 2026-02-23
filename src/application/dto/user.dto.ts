import { UserEntity } from '@/core/entities/user.entity';
import { PaginationResponse } from './pagination.dto';

export interface UserResponse {
  data: UserEntity[];
  meta: PaginationResponse;
}

export interface UserRequest {
  page: number;
  limit?: number;
  search?: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  id: number;
  username?: string;
  email?: string;
  isActive?: boolean;
}
