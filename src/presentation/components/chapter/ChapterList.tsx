import React from 'react';
import { ChapterEntity } from '@/core/entities';
import { Badge } from '@/presentation/components/base';
import { EditIcon, TrashIcon } from '@/presentation/components/base/icons';

interface ChapterListProps {
  chapters: ChapterEntity[];
  onEdit: (chapter: ChapterEntity) => void;
  onDelete: (chapter: ChapterEntity) => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  chapters = [],
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}) => {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange(chapters.map((c) => c.id!));
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
    chapters.length > 0 && chapters.every((c) => selectedIds.includes(c.id!));

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col">
      <div className="min-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-bg-main)]">
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
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-1/5 min-w-[200px]">
                Book Title
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-20 text-center">
                No.
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-1/4 min-w-[200px]">
                Chapter Name
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-1/4 min-w-[200px]">
                Category
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-1/3 min-w-[250px]">
                Summary
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-24 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-light)]">
            {chapters.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-[var(--color-text-muted)] text-[0.875rem]"
                >
                  Tidak ada data yang ditampilkan
                </td>
              </tr>
            ) : (
              chapters.map((chapter) => (
                <tr
                  key={chapter.id}
                  className="hover:bg-[var(--color-bg-main)] transition-colors group"
                >
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      checked={selectedIds.includes(chapter.id!)}
                      onChange={() => handleSelectOne(chapter.id!)}
                    />
                  </td>

                  {/* ID */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.875rem] text-[var(--color-text-muted)]">
                    #{chapter.id}
                  </td>

                  {/* Book Title */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="font-medium text-[var(--color-text-primary)] text-[clamp(0.9rem,1.1vw,1.05rem)]">
                      {/* Placeholder for Book Title */}
                      {chapter.book?.title}
                    </div>
                  </td>

                  {/* Chapter No */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-center">
                    <Badge
                      variant="default"
                      className="bg-gray-100 text-gray-800"
                    >
                      {chapter.chapterNumber ?? 0}
                    </Badge>
                  </td>

                  {/* Chapter Name */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="font-semibold text-[var(--color-text-primary)] text-[clamp(0.95rem,1.2vw,1.1rem)]">
                      {chapter.title}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="text-[var(--color-text-primary)] text-[clamp(0.875rem,1vw,1rem)]">
                      {chapter.category}
                    </div>
                  </td>

                  {/* Summary */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="text-[var(--color-text-secondary)] text-[clamp(0.875rem,1vw,1rem)] line-clamp-2 max-w-prose">
                      {chapter.description}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-center">
                    <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(chapter)}
                        className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <EditIcon size={20} />
                      </button>
                      <button
                        onClick={() => onDelete(chapter)}
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
