import React from 'react';
import { BookmarkEntity } from '@/core/entities';
import { EditIcon, TrashIcon } from '@/presentation/components/base/icons';

interface BookmarkListProps {
  bookmarks: BookmarkEntity[];
  onEdit: (bookmark: BookmarkEntity) => void;
  onDelete: (bookmark: BookmarkEntity) => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks = [],
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}) => {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange(bookmarks.map((b) => b.id!));
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
    bookmarks.length > 0 && bookmarks.every((b) => selectedIds.includes(b.id!));

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
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-24">
                Verse ID
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-24">
                User ID
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-1/4">
                Note
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-32">
                Created At
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-24 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-light)]">
            {bookmarks.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-[var(--color-text-muted)] text-[0.875rem]"
                >
                  Tidak ada data yang ditampilkan
                </td>
              </tr>
            ) : (
              bookmarks.map((bookmark) => (
                <tr
                  key={bookmark.id}
                  className="hover:bg-[var(--color-bg-main)] transition-colors group"
                >
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      checked={selectedIds.includes(bookmark.id!)}
                      onChange={() => handleSelectOne(bookmark.id!)}
                    />
                  </td>

                  {/* ID */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.875rem] text-[var(--color-text-muted)] font-medium">
                    #B-{bookmark.id}
                  </td>

                  {/* Verse ID */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="font-medium text-[var(--color-text-primary)] text-[clamp(0.9rem,1.1vw,1.05rem)]">
                      {bookmark.verseId}
                    </div>
                  </td>

                  {/* User ID */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="font-medium text-gray-500">
                      {bookmark.userId}
                    </div>
                  </td>

                  {/* Note */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="text-sm font-medium text-text-primary line-clamp-2">
                      {bookmark.note || '-'}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.875rem] text-[var(--color-text-muted)]">
                    {new Date(bookmark.createdAt).toLocaleDateString('id-ID')}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-center">
                    <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(bookmark)}
                        className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <EditIcon size={20} />
                      </button>
                      <button
                        onClick={() => onDelete(bookmark)}
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
