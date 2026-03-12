import {
  UserRequest,
  UserResponse,
  UserCreateRequest,
  UserUpdateRequest,
} from '@/application/dto';
import { useUserManager } from '@/presentation/hooks/useUserManager';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '@/shared/utils';

export interface UserViewModelState {
  isLoading: boolean;
  error: string | null;
  userList: UserResponse | null;
  criteria: UserRequest;
}

export interface UserViewModelActions {
  findUser: (newCriteria?: Partial<UserRequest>, options?: { silent?: boolean }) => Promise<void>;
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

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Action
  const findUser = useCallback(
    async (newCriteria?: Partial<UserRequest>, options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setIsLoading(true);
        setError(null);
      }

      let criteriaToUse = criteria;

      if (newCriteria) {
        criteriaToUse = { ...criteria, ...newCriteria };
        setCriteria(criteriaToUse);
      }

      try {
        const result = await findUserHook(criteriaToUse);
        if (!mountedRef.current) return;

        if (result.success) {
          setUserList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
      } finally {
        if (mountedRef.current && !options?.silent) setIsLoading(false);
      }
    },
    [findUserHook, criteria]
  );

  const fetchRef = useRef(findUser);
  fetchRef.current = findUser;

  const createUser = useCallback(
    async (data: UserCreateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createUserHook(data);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [createUserHook]
  );

  const updateUser = useCallback(
    async (data: UserUpdateRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateUserHook(data);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [updateUserHook]
  );

  const deleteUser = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteUserHook(id);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [deleteUserHook]
  );

  const bulkDeleteUser = useCallback(
    async (ids: number[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await bulkDeleteUserHook(ids);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [bulkDeleteUserHook]
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
