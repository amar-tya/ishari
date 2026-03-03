import React from 'react';
import { VerseMediaEntity, HadiEntityList } from '@/core/entities';
import { AudioPlayer } from './AudioPlayer';

interface VerseMediaListProps {
  mediaList: VerseMediaEntity[];
  hadiList: HadiEntityList | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const VerseMediaList: React.FC<VerseMediaListProps> = ({
  mediaList,
  hadiList,
  onEdit,
  onDelete,
}) => {
  const getHadiName = (hadiId: number | null) => {
    if (!hadiId || !hadiList) return '-';
    const hadi = hadiList.data.find((h) => h.id === hadiId);
    return hadi ? hadi.name : '-';
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden flex flex-col">
      <div className="min-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-light bg-bg-main">
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider w-16">
                ID
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider">
                Verse ID
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider">
                Hadi
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider">
                Type
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider w-1/4">
                Media File
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider">
                Size
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider w-1/4">
                Description
              </th>
              <th className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-caption font-semibold text-text-secondary uppercase tracking-wider text-center w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {mediaList.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-text-muted text-body"
                >
                  Tidak ada data media yang ditampilkan
                </td>
              </tr>
            ) : (
              mediaList.map((media) => (
                <tr
                  key={media.id}
                  className="hover:bg-bg-main transition-colors group"
                >
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-description text-text-muted">
                    {media.id}
                  </td>
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="text-subtitle font-semibold text-text-primary">
                      {media.verseId}
                    </div>
                  </td>
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="text-description text-text-secondary">
                      {getHadiName(media.hadiId)}
                    </div>
                  </td>
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="text-description font-medium text-primary bg-primary/5 px-2 py-1 rounded-md inline-block">
                      {media.type || '-'}
                    </div>
                  </td>
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    {media.mediaType === 'audio' ? (
                      <AudioPlayer src={media.mediaUrl} />
                    ) : (
                      <a
                        href={media.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Image
                      </a>
                    )}
                  </td>
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-description text-text-secondary">
                    {formatFileSize(media.fileSize)}
                  </td>
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)]">
                    <div className="text-description text-text-secondary line-clamp-2 max-w-prose">
                      {media.description || '-'}
                    </div>
                  </td>
                  <td className="py-4 px-[clamp(1rem,1.5vw,1.5rem)] text-center">
                    <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(media.id)}
                        className="p-1 text-text-secondary hover:text-primary transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <svg
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
                        onClick={() => onDelete(media.id)}
                        className="p-1 text-text-secondary hover:text-error transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <svg
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
