'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVerse, useChapter, useBookmark } from '@/presentation/hooks';
import { useUser } from '@/presentation/hooks/useUser';
import { VerseEntity, ChapterEntity } from '@/core/entities';
import { PublicSidebar } from './PublicSidebar';
import { VerseItem } from './VerseItem';
import { PublicAudioPlayer } from './PublicAudioPlayer';
import { VerseActionSheet } from './VerseActionSheet';
import { BookmarkNoteModal } from './BookmarkNoteModal';
import { SuccessModal } from '@/presentation/components/base/SuccessModal';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TranslationsIcon,
} from '@/presentation/components/base/icons';
import { ChapterSelectionModal } from './ChapterSelectionModal';
import { useRouter } from 'next/navigation';

export function PublicDashboard() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const chapterId = idParam ? parseInt(idParam, 10) : 1;

  const { findVerse } = useVerse();
  const { findChapter } = useChapter();
  const { findBookmark, createBookmark, deleteBookmark } = useBookmark();
  const { user, isLoading: isUserLoading } = useUser();

  const [chapter, setChapter] = useState<ChapterEntity | null>(null);
  const [verses, setVerses] = useState<VerseEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  // Bookmark state: verseId → bookmarkId
  const [bookmarkedMap, setBookmarkedMap] = useState<Map<number, number>>(
    new Map()
  );
  const [bookmarkNoteVerse, setBookmarkNoteVerse] =
    useState<VerseEntity | null>(null);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const [selectedVerseForAudio, setSelectedVerseForAudio] =
    useState<VerseEntity | null>(null);
  const [isAudioSheetOpen, setIsAudioSheetOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  const router = useRouter();

  // Load bookmarks for logged-in user
  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      setBookmarkedMap(new Map());
      return;
    }
    const loadBookmarks = async () => {
      const res = await findBookmark({ page: 1, limit: 1000 });
      if (res.success) {
        const map = new Map<number, number>();
        res.data.data.forEach((b) => {
          if (b.verseId && b.id) map.set(b.verseId, b.id);
        });
        setBookmarkedMap(map);
      }
    };
    loadBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isUserLoading]);

  const handleBookmarkToggle = useCallback(
    async (verse: VerseEntity) => {
      if (!verse.id) return;
      const existingBookmarkId = bookmarkedMap.get(verse.id);
      if (existingBookmarkId) {
        // Already bookmarked → delete
        setIsBookmarkLoading(true);
        const res = await deleteBookmark(existingBookmarkId);
        setIsBookmarkLoading(false);
        if (res.success) {
          setBookmarkedMap((prev) => {
            const next = new Map(prev);
            next.delete(verse.id!);
            return next;
          });
          setSuccessModal({
            isOpen: true,
            title: 'Bookmark Dihapus',
            message: 'Ayat berhasil dihapus dari bookmark Anda.',
          });
        }
      } else {
        // Not bookmarked → open note modal
        setBookmarkNoteVerse(verse);
        setIsBookmarkModalOpen(true);
      }
    },
    [bookmarkedMap, deleteBookmark]
  );

  const handleBookmarkSubmit = useCallback(
    async (note: string) => {
      if (!bookmarkNoteVerse?.id) return;
      setIsBookmarkLoading(true);
      const res = await createBookmark({
        verseId: bookmarkNoteVerse.id,
        note,
      });
      setIsBookmarkLoading(false);
      if (res.success && res.data.id) {
        setBookmarkedMap((prev) => {
          const next = new Map(prev);
          next.set(bookmarkNoteVerse.id!, res.data.id!);
          return next;
        });
        setIsBookmarkModalOpen(false);
        setBookmarkNoteVerse(null);
        setSuccessModal({
          isOpen: true,
          title: 'Bookmark Disimpan',
          message: 'Ayat berhasil ditambahkan ke bookmark Anda.',
        });
      }
    },
    [bookmarkNoteVerse, createBookmark]
  );

  const handlePlayClick = (verse: VerseEntity) => {
    setSelectedVerseForAudio(verse);
    setIsAudioSheetOpen(true);
  };

  const handleChapterSelect = (selectedChapterId: number) => {
    router.push(`/?id=${selectedChapterId}`);
  };

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setVerses([]);
      setChapter(null);
      try {
        const [chapterRes, versesRes] = await Promise.all([
          findChapter({ page: 1, limit: 1, chapterId }),
          findVerse({ page: 1, limit: 30, chapterId }),
        ]);
        if (cancelled) return;
        if (chapterRes.success && chapterRes.data.data.length > 0) {
          setChapter(chapterRes.data.data[0]);
        }
        if (versesRes.success) {
          setVerses(versesRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [chapterId, findChapter, findVerse]);

  return (
    <>
      <main className="flex-1 w-full max-w-300 mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <PublicSidebar
          chapter={chapter}
          showTranslation={showTranslation}
          setShowTranslation={setShowTranslation}
        />

        {/* Center Column */}
        <section className="lg:col-span-9 flex flex-col gap-6">
          <div className="lg:hidden flex justify-between items-end mb-4">
            <div
              onClick={() => setIsChapterModalOpen(true)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <h1 className="text-[clamp(1.25rem,4vw,1.75rem)] font-bold text-[#1e293b]">
                {chapter?.title || 'Loading...'}
              </h1>
              <p className="text-[#475569]">
                {chapter?.title || 'Unknown'} • {chapter?.category || 'Meccan'}
              </p>
            </div>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`h-9 px-3 rounded-full flex items-center gap-1.5 transition-all outline-none border ${
                showTranslation
                  ? 'bg-white text-[#51c878] border-slate-100 shadow-sm'
                  : 'bg-slate-100 text-slate-500 border-transparent shadow-none'
              }`}
            >
              <TranslationsIcon size={16} />
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {showTranslation ? 'Sembunyikan' : 'Tampilkan'}
              </span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin size-8 border-4 border-[#51c878] border-t-transparent rounded-full" />
            </div>
          ) : verses.length === 0 ? (
            <div className="text-center p-12 text-slate-500">
              Verses not found.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
              {verses.map((verse) => (
                <VerseItem
                  key={verse.id}
                  verse={verse}
                  showTranslation={showTranslation}
                  onPlayClick={handlePlayClick}
                  isBookmarked={bookmarkedMap.has(verse.id!)}
                  onBookmarkToggle={handleBookmarkToggle}
                  isUser={!!user}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8 pb-12">
            <div className="flex gap-2 items-center bg-white p-2 rounded-2xl shadow-[4px_4px_10px_rgba(81,200,120,0.1),-4px_-4px_10px_rgba(255,255,255,0.8)]">
              <button className="size-10 flex items-center justify-center hover:bg-slate-100 rounded-xl text-slate-400">
                <ChevronLeftIcon size={24} />
              </button>
              <div className="px-4 font-semibold text-[#1e293b]">
                Page 1 of 1
              </div>
              <button className="size-10 flex items-center justify-center bg-[#51c878] text-white rounded-xl shadow-lg shadow-[#51c878]/30">
                <ChevronRightIcon size={24} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicAudioPlayer />

      <BookmarkNoteModal
        isOpen={isBookmarkModalOpen}
        verse={bookmarkNoteVerse}
        onClose={() => {
          setIsBookmarkModalOpen(false);
          setBookmarkNoteVerse(null);
        }}
        onSubmit={handleBookmarkSubmit}
        isLoading={isBookmarkLoading}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
      />

      <VerseActionSheet
        isOpen={isAudioSheetOpen}
        onClose={() => setIsAudioSheetOpen(false)}
        verse={selectedVerseForAudio}
      />

      <ChapterSelectionModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        onSelect={handleChapterSelect}
        currentChapterId={chapterId}
      />
    </>
  );
}
