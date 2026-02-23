'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useUserViewModel } from '@/presentation/view-models/user/UserViewModel';
import {
  UserList,
  UserToolbar,
  UserForm,
} from '@/presentation/components/user';
import { Pagination } from '@/presentation/components/books/Pagination';
import { UserEntity } from '@/core/entities';
import { UserCreateRequest, UserUpdateRequest } from '@/application/dto';
import { SuccessModal } from '@/presentation/components/base/SuccessModal';
import { ConfirmModal } from '@/presentation/components/base/ConfirmModal';

export default function UsersPage() {
  const {
    isLoading: isUserLoading,
    error: userError,
    userList,
    findUser,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUser,
  } = useUserViewModel();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<UserEntity | undefined>(
    undefined
  );
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    findUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      findUser({ page: 1, limit: 10, search });
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Success Modal State
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'delete' as 'delete' | 'confirm',
    onConfirm: async () => {},
  });

  const handlePageChange = useCallback(
    (page: number) => {
      findUser({ page, limit: 10, search });
    },
    [search, findUser]
  );

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleNewUser = () => {
    setFormMode('create');
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserEntity) => {
    setFormMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: UserEntity) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus User',
      message: `Apakah Anda yakin ingin menghapus user dengan username ${user.username}?`,
      type: 'delete',
      onConfirm: async () => {
        if (user.id) {
          const success = await deleteUser(user.id);
          if (success) {
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            setSuccessModal({
              isOpen: true,
              title: 'Berhasil Menghapus User',
              message: 'User berhasil dihapus dari sistem.',
            });
          }
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedUserIds.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: 'Hapus User Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedUserIds.length} user terpilih?`,
      type: 'delete',
      onConfirm: async () => {
        const success = await bulkDeleteUser(selectedUserIds);
        if (success) {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          setSuccessModal({
            isOpen: true,
            title: 'Berhasil Menghapus User',
            message: `${selectedUserIds.length} user berhasil dihapus dari sistem.`,
          });
          setSelectedUserIds([]);
        }
      },
    });
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedUserIds(ids);
  };

  const handleFormSubmit = async (
    data: UserCreateRequest | UserUpdateRequest
  ) => {
    if (formMode === 'create') {
      const success = await createUser(data as UserCreateRequest);
      if (success) {
        setIsModalOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Membuat User',
          message: 'User baru berhasil ditambahkan ke dalam sistem.',
        });
      }
      return success;
    } else {
      const success = await updateUser(data as UserUpdateRequest);
      if (success) {
        setIsModalOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Update User',
          message: 'Data user berhasil diperbarui.',
        });
      }
      return success;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-[clamp(1rem,2vw,2rem)] flex flex-col gap-[clamp(1.5rem,2.5vw,2.5rem)]">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[clamp(1.5rem,2.5vw,2rem)] font-bold text-primary">
          Users Management
        </h1>
        <p className="text-text-secondary text-[clamp(0.875rem,1vw,1rem)]">
          Manage, edit, and organize the application users.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="flex flex-col gap-[clamp(1.5rem,2vw,2rem)]">
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          <UserToolbar
            onSearch={handleSearch}
            onNewUserClick={handleNewUser}
            onBulkDeleteClick={handleBulkDelete}
          />

          {/* Loading State */}
          {isUserLoading && !userList && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error State */}
          {userError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {userError}
            </div>
          )}

          {/* User List */}
          {(!isUserLoading || userList) && !userError && (
            <UserList
              users={userList?.data || []}
              onEdit={handleEditUser}
              onDelete={handleDelete}
              selectedIds={selectedUserIds}
              onSelectionChange={handleSelectionChange}
            />
          )}

          {/* Pagination */}
          {userList?.meta && (
            <Pagination
              currentPage={userList.meta.page}
              totalPages={userList.meta.totalPages}
              totalEntries={userList.meta.total}
              pageSize={userList.meta.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <UserForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          isLoading={isUserLoading}
          mode={formMode}
          initialData={selectedUser}
          error={userError}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        isLoading={isUserLoading}
        variant="danger"
      />
    </div>
  );
}
