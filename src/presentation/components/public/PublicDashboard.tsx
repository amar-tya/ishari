'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVerse, useChapter } from '@/presentation/hooks';
import { VerseEntity, ChapterEntity } from '@/core/entities';
import { PublicSidebar } from './PublicSidebar';
import { VerseItem } from './VerseItem';
import { PublicAudioPlayer } from './PublicAudioPlayer';
import { VerseActionSheet } from './VerseActionSheet';
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

  const [chapter, setChapter] = useState<ChapterEntity | null>(null);
  const [verses, setVerses] = useState<VerseEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  const [selectedVerseForAudio, setSelectedVerseForAudio] =
    useState<VerseEntity | null>(null);
  const [isAudioSheetOpen, setIsAudioSheetOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  const router = useRouter();

  const handlePlayClick = (verse: VerseEntity) => {
    setSelectedVerseForAudio(verse);
    setIsAudioSheetOpen(true);
  };

  const handleChapterSelect = (selectedChapterId: number) => {
    router.push(`/?id=${selectedChapterId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Chapter details
        const chapterRes = await findChapter({ page: 1, limit: 1, chapterId });
        if (chapterRes.success && chapterRes.data.data.length > 0) {
          setChapter(chapterRes.data.data[0]);
        }

        // Fetch Verses for this chapter
        const versesRes = await findVerse({ page: 1, limit: 30, chapterId });
        if (versesRes.success) {
          setVerses(versesRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chapterId, findChapter, findVerse]);

  return (
    <>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <PublicSidebar
          chapter={chapter}
          showTranslation={showTranslation}
          setShowTranslation={setShowTranslation}
        />

        {/* Center Column */}
        <section className="lg:col-span-9 flex flex-col gap-4">
          {/* Mobile Header */}
          <div className="lg:hidden flex justify-between items-end mb-2">
            <div
              onClick={() => setIsChapterModalOpen(true)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                {chapter?.title || 'Memuat...'}
              </h1>
              <p className="text-slate-500 text-sm">
                {chapter?.category || 'Kategori'} • {chapter?.totalVerses || 0} Ayat
              </p>
            </div>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`h-9 px-4 rounded-xl flex items-center gap-2 transition-all text-sm font-medium ${
                showTranslation
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <TranslationsIcon size={16} />
              <span className="hidden sm:inline">
                {showTranslation ? 'Sembunyikan' : 'Terjemahan'}
              </span>
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
            </div>
          ) : verses.length === 0 ? (
            <div className="text-center p-12 text-slate-500 bg-slate-50 rounded-2xl">
              Ayat tidak ditemukan.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              {verses.map((verse) => (
                <VerseItem
                  key={verse.id}
                  verse={verse}
                  showTranslation={showTranslation}
                  onPlayClick={handlePlayClick}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6 pb-8">
            <div className="flex gap-1 items-center bg-white p-1.5 rounded-xl border border-slate-100">
              <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                <ChevronLeftIcon size={20} />
              </button>
              <div className="px-4 font-medium text-slate-700 text-sm">
                Halaman 1 dari 1
              </div>
              <button className="w-10 h-10 flex items-center justify-center bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <ChevronRightIcon size={20} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicAudioPlayer />

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
