import React from 'react';
import { UserEntity } from '@/core/entities';
import { EditIcon, TrashIcon } from '@/presentation/components/base/icons';

interface UserListProps {
  users: UserEntity[];
  onEdit: (user: UserEntity) => void;
  onDelete: (user: UserEntity) => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users = [],
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}) => {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange(users.map((u) => u.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const isAllSelected =
    users.length > 0 && users.every((u) => selectedIds.includes(u.id));

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col">
      <div className="min-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border-light)] bg-[#F0F4F8]">
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-24">
                ID
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-1/4">
                Username
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-1/4">
                Email
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-32 border-none">
                Status
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-32">
                Last Login
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-24 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-light)]">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-[var(--color-text-muted)] text-[0.875rem]"
                >
                  Tidak ada data yang ditampilkan
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[var(--color-bg-main)] transition-colors group"
                >
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleSelectOne(user.id)}
                    />
                  </td>

                  {/* ID */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.875rem] text-[var(--color-text-muted)] font-medium">
                    #U-{user.id}
                  </td>

                  {/* Username */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="font-medium text-[var(--color-text-primary)] text-[clamp(0.9rem,1.1vw,1.05rem)]">
                      {user.username}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[var(--color-text-secondary)] text-[0.875rem]">
                    {user.email}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Last Login */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.875rem] text-[var(--color-text-muted)]">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : '-'}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-center">
                    <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <EditIcon size={20} />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="p-1 text-[var(--color-text-secondary)] hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <TrashIcon size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
