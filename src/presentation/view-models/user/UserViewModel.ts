import {
  UserRequest,
  UserResponse,
  UserCreateRequest,
  UserUpdateRequest,
} from '@/application/dto';
import { useUserManager } from '@/presentation/hooks/useUserManager';
import { useCallback, useState } from 'react';
import { getErrorMessage } from '@/shared/utils';

export interface UserViewModelState {
  isLoading: boolean;
  error: string | null;
  userList: UserResponse | null;
  criteria: UserRequest;
}

export interface UserViewModelActions {
  findUser: (newCriteria?: Partial<UserRequest>) => Promise<void>;
  setCriteria: (criteria: UserRequest) => void;
  createUser: (data: UserCreateRequest) => Promise<boolean>;
  updateUser: (data: UserUpdateRequest) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  bulkDeleteUser: (ids: number[]) => Promise<boolean>;
}

export type UserViewModel = UserViewModelState & UserViewModelActions;

export function useUserViewModel(): UserViewModel {
  const {
    findUser: findUserHook,
    createUser: createUserHook,
    updateUser: updateUserHook,
    deleteUser: deleteUserHook,
    bulkDeleteUser: bulkDeleteUserHook,
  } = useUserManager();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userList, setUserList] = useState<UserResponse | null>(null);
  const [criteria, setCriteria] = useState<UserRequest>({
    page: 1,
    limit: 10,
    search: '',
  });

  // Action
  const findUser = useCallback(
    async (newCriteria?: Partial<UserRequest>) => {
      setIsLoading(true);
      setError(null);

      let criteriaToUse = criteria;

      if (newCriteria) {
        criteriaToUse = { ...criteria, ...newCriteria };
        setCriteria(criteriaToUse);
      }

      try {
        const result = await findUserHook(criteriaToUse);
        if (result.success) {
          setUserList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [findUserHook, criteria]
  );

  const createUser = useCallback(
    async (data: UserCreateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createUserHook(data);
        if (result.success) {
          await findUser();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [createUserHook, findUser]
  );

  const updateUser = useCallback(
    async (data: UserUpdateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateUserHook(data);
        if (result.success) {
          await findUser();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [updateUserHook, findUser]
  );

  const deleteUser = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteUserHook(id);
        if (result.success) {
          await findUser();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [deleteUserHook, findUser]
  );

  const bulkDeleteUser = useCallback(
    async (ids: number[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await bulkDeleteUserHook(ids);
        if (result.success) {
          await findUser();
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [bulkDeleteUserHook, findUser]
  );

  return {
    isLoading,
    error,
    userList,
    criteria,
    findUser,
    setCriteria,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUser,
  };
}
