'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBookmark, useVerse } from '@/presentation/hooks';
import { useUser } from '@/presentation/hooks/useUser';
import { VerseEntity } from '@/core/entities';
import { BookmarkEntity } from '@/core/entities/bookmark.entity';
import { VerseItem } from './VerseItem';
import { PublicAudioPlayer } from './PublicAudioPlayer';
import { VerseActionSheet } from './VerseActionSheet';
import { SuccessModal } from '@/presentation/components/base/SuccessModal';
import { BookmarkIcon, TrashIcon } from '@/presentation/components/base/icons';

interface BookmarkWithVerse {
  bookmark: BookmarkEntity;
  verse: VerseEntity;
}

export function BookmarkList() {
  const { findBookmark, deleteBookmark } = useBookmark();
  const { findVerse } = useVerse();
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();

  const [items, setItems] = useState<BookmarkWithVerse[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVerseForAudio, setSelectedVerseForAudio] =
    useState<VerseEntity | null>(null);
  const [isAudioSheetOpen, setIsAudioSheetOpen] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const bookmarkRes = await findBookmark({ page: 1, limit: 1000 });
        if (cancelled) return;
        if (!bookmarkRes.success || bookmarkRes.data.data.length === 0) {
          setItems([]);
          return;
        }

        const bookmarks = bookmarkRes.data.data;
        const verseIds = bookmarks.map((b) => b.verseId).filter(Boolean);

        const verseRes = await findVerse({
          page: 1,
          limit: 1000,
          verseIds,
        });

        if (cancelled) return;
        if (!verseRes.success) {
          setItems([]);
          return;
        }

        const verseMap = new Map<number, VerseEntity>(
          verseRes.data.data.map((v) => [v.id, v])
        );

        const combined: BookmarkWithVerse[] = bookmarks
          .filter((b) => verseMap.has(b.verseId))
          .map((b) => ({
            bookmark: b,
            verse: verseMap.get(b.verseId)!,
          }));

        setItems(combined);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isUserLoading]);

  const handleDelete = useCallback(
    async (bookmarkId: number, verseId: number) => {
      setDeletingId(bookmarkId);
      const res = await deleteBookmark(bookmarkId);
      setDeletingId(null);
      if (res.success) {
        setItems((prev) =>
          prev.filter((item) => item.bookmark.id !== bookmarkId)
        );
        setSuccessModal({
          isOpen: true,
          title: 'Bookmark Dihapus',
          message: 'Ayat berhasil dihapus dari bookmark Anda.',
        });
      }
    },
    [deleteBookmark]
  );

  const handlePlayClick = (verse: VerseEntity) => {
    setSelectedVerseForAudio(verse);
    setIsAudioSheetOpen(true);
  };

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!loading && !isUserLoading && !user) {
    return (
      <div className="flex-1 w-full max-w-200 mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="size-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Login Diperlukan
          </h2>
          <p className="text-slate-500">
            Login untuk melihat ayat-ayat yang telah Anda bookmark.
          </p>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="px-8 h-11 rounded-2xl bg-[#51c878] text-white font-bold text-sm hover:bg-[#3da35f] transition-colors shadow-lg shadow-[#51c878]/25"
        >
          Masuk
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 w-full max-w-200 mx-auto p-6 pb-28">
        {/* Page Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-heading font-semibold text-[#0f172a] tracking-tight">
                Bookmark Saya
              </h1>
              {!loading && (
                <p className="text-slate-500 text-sm font-medium">
                  {items.length} ayat tersimpan
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin size-10 border-4 border-[#51c878] border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          // ── Empty State ────────────────────────────────────────────────────
          <div className="flex flex-col items-center justify-center py-24 gap-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="size-20 rounded-3xl bg-[#e6f7ec] flex items-center justify-center text-[#51c878] opacity-60">
              <BookmarkIcon size={40} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-700 mb-1">
                Belum ada bookmark
              </h3>
              <p className="text-slate-400 text-sm">
                Tandai ayat favorit Anda saat membaca untuk menyimpannya di
                sini.
              </p>
            </div>
            <Link
              href="/"
              className="px-8 h-11 rounded-2xl bg-[#51c878] text-white font-bold text-sm hover:bg-[#3da35f] transition-colors shadow-lg shadow-[#51c878]/25 flex items-center"
            >
              Mulai Membaca
            </Link>
          </div>
        ) : (
          (() => {
            // Group by chapter
            const grouped = items.reduce<
              Record<
                string,
                {
                  chapterTitle: string;
                  chapterId: number | undefined;
                  items: BookmarkWithVerse[];
                }
              >
            >((acc, item) => {
              const key = String(item.verse.chapter?.id ?? 'unknown');
              if (!acc[key]) {
                acc[key] = {
                  chapterTitle: item.verse.chapter?.title ?? 'Tanpa Chapter',
                  chapterId: item.verse.chapter?.id,
                  items: [],
                };
              }
              acc[key].items.push(item);
              return acc;
            }, {});

            return (
              <div className="flex flex-col gap-8">
                {Object.values(grouped).map((group) => (
                  <div key={group.chapterTitle}>
                    {/* Chapter Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-8 rounded-xl bg-[#e6f7ec] border border-[#51c878]/20 flex items-center justify-center text-[#51c878]">
                        <BookmarkIcon size={14} filled />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-[#0f172a]">
                          {group.chapterTitle}
                        </h2>
                        <p className="text-xs text-slate-400">
                          {group.items.length} ayat
                        </p>
                      </div>
                      {group.chapterId && (
                        <Link
                          href={`/?id=${group.chapterId}`}
                          className="ml-auto text-xs font-semibold text-[#51c878] hover:text-[#3da35f] transition-colors shrink-0"
                        >
                          Buka Muhud →
                        </Link>
                      )}
                    </div>

                    {/* Verse Cards */}
                    <div className="flex flex-col gap-3">
                      {group.items.map(({ bookmark, verse }) => (
                        <div
                          key={bookmark.id}
                          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                        >
                          {/* Verse number label */}
                          <div className="px-5 pt-4 pb-0">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f7ec] border border-[#51c878]/20 text-[#258b45] text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#51c878]" />
                              Ayat {verse.verseNumber}
                            </span>
                          </div>

                          <VerseItem
                            verse={verse}
                            showTranslation={true}
                            onPlayClick={handlePlayClick}
                            isBookmarked={true}
                            isUser={false}
                          />

                          {/* Note + Delete row */}
                          <div className="px-5 py-2 flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              {bookmark.note && (
                                <p className="text-slate-400 text-sm italic line-clamp-2">
                                  &ldquo;{bookmark.note}&rdquo;
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleDelete(bookmark.id!, verse.id)
                              }
                              disabled={deletingId === bookmark.id}
                              title="Hapus Bookmark"
                              className="shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all text-xs font-semibold disabled:opacity-50"
                            >
                              {deletingId === bookmark.id ? (
                                <div className="size-3 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <TrashIcon size={14} />
                              )}
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </div>

      <PublicAudioPlayer />

      <VerseActionSheet
        isOpen={isAudioSheetOpen}
        onClose={() => setIsAudioSheetOpen(false)}
        verse={selectedVerseForAudio}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
      />
    </>
  );
}
