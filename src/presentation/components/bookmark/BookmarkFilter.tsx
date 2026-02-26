import React, { useState } from 'react';
import { CloseIcon, ChevronDownIcon } from '../base/icons';
import { BookmarkFilter as IBookmarkFilter } from '@/application/dto';
import { UserEntity } from '@/core/entities';

interface BookmarkFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: Partial<IBookmarkFilter>) => void;
  initialFilter?: Partial<IBookmarkFilter>;
  users: UserEntity[];
}

export const BookmarkFilter: React.FC<BookmarkFilterProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilter,
  users,
}) => {
  const [search, setSearch] = useState<string>(initialFilter?.search || '');
  const [userId, setUserId] = useState<string>(
    initialFilter?.userId?.toString() || ''
  );

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      search: search || undefined,
      userId: userId ? Number(userId) : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setSearch('');
    setUserId('');
    onApply({
      search: undefined,
      userId: undefined,
    });
    onClose();
  };

  return (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
    >
      <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h3
            className="text-lg font-bold text-slate-900 dark:text-white"
            id="modal-title"
          >
            Filter Bookmarks
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              htmlFor="filter-user"
            >
              User
            </label>
            <div className="relative">
              <select
                id="filter-user"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block appearance-none"
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDownIcon size={20} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              htmlFor="filter-search"
            >
              Search Notes
            </label>
            <input
              id="filter-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in notes..."
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl border-t border-slate-100 dark:border-slate-800 flex items-center justify-between sm:justify-end gap-3 flex-col sm:flex-row">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all shadow-lg shadow-primary/25"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};
