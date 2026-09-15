import React, { useEffect, useState } from 'react';
import { Button } from '../base/Button';
import { SearchInput } from '../base/SearchInput';
import { PlusIcon } from '../base/icons';
import { HadiEntityList } from '@/core/entities';
import { useBookViewModel, useChapterViewModel } from '@/presentation/view-models';

interface ChapterMediaToolbarProps {
  onSearch: (query: string) => void;
  onHadiChange: (hadiId: number | null) => void;
  onChapterChange: (chapterId: number | null) => void;
  onNewMediaClick: () => void;
  hadiList: HadiEntityList | null;
  selectedHadiId: number | null;
  selectedChapterId: number | null;
}

export const ChapterMediaToolbar: React.FC<ChapterMediaToolbarProps> = ({
  onSearch,
  onHadiChange,
  onChapterChange,
  onNewMediaClick,
  hadiList,
  selectedHadiId,
  selectedChapterId,
}) => {
  const { bookList, getBookList } = useBookViewModel();
  const { chapterList, findChapter } = useChapterViewModel();
  const [bookId, setBookId] = useState('');

  useEffect(() => {
    getBookList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBookId(val);
    onChapterChange(null);
    if (val) {
      findChapter({ bookId: Number(val), limit: 1000 });
    }
  };
  const textStyle: React.CSSProperties = {
    maxWidth: 'clamp(0px, calc( ( 100vw - 600px ) * 1000 ), 100%)',
    opacity: 'clamp(0, calc( ( 100vw - 600px ) * 1000 ), 1)',
    fontSize: 'clamp(0px, calc( ( 100vw - 600px ) * 1000 ), 1em)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  const buttonPaddingStyle = {
    paddingLeft: 'clamp(8px, calc( ( 100vw - 600px ) * 1000 ), 1rem)',
    paddingRight: 'clamp(8px, calc( ( 100vw - 600px ) * 1000 ), 1rem)',
    gap: 'clamp(0px, calc( ( 100vw - 600px ) * 1000 ), 0.5rem)',
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-[clamp(0.75rem,2vw,1.5rem)] bg-white p-[clamp(0.75rem,1.5vw,1.25rem)] rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
      {/* Search & Filters */}
      <div className="flex-[999_1_300px] w-full min-w-[300px] flex items-center gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Search Description..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-border-light rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[200px]"
          value={selectedHadiId || ''}
          onChange={(e) => {
            const val = e.target.value;
            onHadiChange(val ? Number(val) : null);
          }}
        >
          <option value="">All Hadi</option>
          {hadiList?.data.map((hadi) => (
            <option key={hadi.id} value={hadi.id}>
              {hadi.name}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-border-light rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[200px]"
          value={bookId}
          onChange={handleBookChange}
        >
          <option value="">All Kitab</option>
          {bookList?.data.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-border-light rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
          value={selectedChapterId || ''}
          disabled={!bookId}
          onChange={(e) => {
            const val = e.target.value;
            onChapterChange(val ? Number(val) : null);
          }}
        >
          <option value="">All Chapter</option>
          {chapterList?.data.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.chapterNumber}. {chapter.title}
            </option>
          ))}
        </select>
      </div>

      {/* Actions Group */}
      <div className="flex flex-wrap items-center gap-[clamp(0.5rem,1vw,1rem)] flex-[1_1_auto] justify-end">
        <Button
          variant="primary"
          className="!bg-[#22C55E] !border-[#22C55E] hover:!bg-[#1ea34d] transition-all duration-300"
          style={buttonPaddingStyle}
          onClick={onNewMediaClick}
          icon={<PlusIcon size={18} />}
          title="Upload Audio"
        >
          <span style={textStyle}>Upload Audio</span>
        </Button>
      </div>
    </div>
  );
};
