import {
  UserCreateRequest,
  UserRequest,
  UserResponse,
  UserUpdateRequest,
} from '@/application/dto/user.dto';
import { UserEntity } from '@/core/entities';
import { mapResult, Result } from '@/core/types';
import { container } from '@/di';
import { useCallback } from 'react';

export interface UseUserManager {
  findUser: (criteria: UserRequest) => Promise<Result<UserResponse>>;
  createUser: (request: UserCreateRequest) => Promise<Result<UserEntity>>;
  updateUser: (request: UserUpdateRequest) => Promise<Result<UserEntity>>;
  deleteUser: (id: number) => Promise<Result<boolean>>;
  bulkDeleteUser: (ids: number[]) => Promise<Result<boolean>>;
}

export function useUserManager(): UseUserManager {
  const {
    findUserUseCase,
    createUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    bulkDeleteUserUseCase,
  } = container;

  const findUser = useCallback(
    async (criteria: UserRequest): Promise<Result<UserResponse>> => {
      const result = await findUserUseCase.execute(criteria);

      return mapResult(result, (res) => ({
        data: res.data,
        meta: res.meta,
      }));
    },
    [findUserUseCase]
  );

  const createUser = useCallback(
    async (request: UserCreateRequest): Promise<Result<UserEntity>> => {
      const result = await createUserUseCase.execute(request);
      return result;
    },
    [createUserUseCase]
  );

  const updateUser = useCallback(
    async (request: UserUpdateRequest): Promise<Result<UserEntity>> => {
      const result = await updateUserUseCase.execute(request);
      return result;
    },
    [updateUserUseCase]
  );

  const deleteUser = useCallback(
    async (id: number): Promise<Result<boolean>> => {
      const result = await deleteUserUseCase.execute(id);
      return result;
    },
    [deleteUserUseCase]
  );

  const bulkDeleteUser = useCallback(
    async (ids: number[]): Promise<Result<boolean>> => {
      const result = await bulkDeleteUserUseCase.execute(ids);
      return result;
    },
    [bulkDeleteUserUseCase]
  );

  return {
    findUser,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUser,
  };
}
