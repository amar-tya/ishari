import React from 'react';
import { HadiEntity } from '@/core/entities';

interface HadiListProps {
  hadis: HadiEntity[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const HadiList: React.FC<HadiListProps> = ({
  hadis,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden flex flex-col">
      <div className="min-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-light bg-bg-main">
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider w-16">
                ID
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider w-24">
                Photo
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider w-1/4">
                Name
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider w-1/2">
                Description
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider w-24 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {hadis.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-text-muted text-body"
                >
                  Tidak ada data yang ditampilkan
                </td>
              </tr>
            ) : (
              hadis.map((hadi) => (
                <tr
                  key={hadi.id}
                  className="hover:bg-bg-main transition-colors group"
                >
                  {/* ID */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-description text-text-muted">
                    {hadi.id}
                  </td>

                  {/* Photo */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="h-12 w-12 bg-border-light rounded-full flex items-center justify-center text-text-muted overflow-hidden border border-border">
                      {hadi.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={hadi.imageUrl}
                          alt={hadi.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="text-subtitle font-semibold text-text-primary">
                      {hadi.name}
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="text-description text-text-secondary line-clamp-2 max-w-prose">
                      {hadi.description || '-'}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-center">
                    <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(hadi.id)}
                        className="p-1 text-text-secondary hover:text-primary transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(hadi.id)}
                        className="p-1 text-text-secondary hover:text-error transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
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
