import React from 'react';
import { VerseEntity } from '@/core/entities';
import { EditIcon, TrashIcon } from '@/presentation/components/base/icons';

interface VerseListProps {
  verses: VerseEntity[];
  onEdit: (verse: VerseEntity) => void;
  onDelete: (verse: VerseEntity) => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export const VerseList: React.FC<VerseListProps> = ({
  verses = [],
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}) => {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange(verses.map((v) => v.id!));
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
    verses.length > 0 && verses.every((v) => selectedIds.includes(v.id!));

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
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-1/5 min-w-[150px]">
                Chapter
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-20 text-center">
                Verse No.
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-1/4 min-w-[200px]">
                Arabic Text
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-1/4 min-w-[200px]">
                Transliteration
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.75rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider w-24 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-light)]">
            {verses.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-[var(--color-text-muted)] text-[0.875rem]"
                >
                  Tidak ada data yang ditampilkan
                </td>
              </tr>
            ) : (
              verses.map((verse) => (
                <tr
                  key={verse.id}
                  className="hover:bg-[var(--color-bg-main)] transition-colors group"
                >
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      checked={selectedIds.includes(verse.id!)}
                      onChange={() => handleSelectOne(verse.id!)}
                    />
                  </td>

                  {/* ID */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-[0.875rem] text-[var(--color-text-muted)] font-medium">
                    #V-{verse.id}
                  </td>

                  {/* Chapter */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="font-medium text-[var(--color-text-primary)] text-[clamp(0.9rem,1.1vw,1.05rem)]">
                      {verse.chapter?.title}
                    </div>
                  </td>

                  {/* Verse No */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-center text-[var(--color-text-primary)] font-semibold">
                    {verse.verseNumber.toString().padStart(2, '0')}
                  </td>

                  {/* Arabic Text */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]" dir="rtl">
                    <div className="font-arabic text-[clamp(1.1rem,1.5vw,1.4rem)] text-[var(--color-text-primary)] text-right leading-loose">
                      {verse.arabicText}
                    </div>
                  </td>

                  {/* Transliteration */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="text-sm font-medium text-text-primary line-clamp-2">
                      {verse.transliteration}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-center">
                    <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(verse)}
                        className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <EditIcon size={20} />
                      </button>
                      <button
                        onClick={() => onDelete(verse)}
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
