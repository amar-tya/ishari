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

  const handlePlayClick = (verse: VerseEntity) => {
    setSelectedVerseForAudio(verse);
    setIsAudioSheetOpen(true);
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
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <PublicSidebar
          chapter={chapter}
          showTranslation={showTranslation}
          setShowTranslation={setShowTranslation}
        />

        {/* Center Column */}
        <section className="lg:col-span-9 flex flex-col gap-6">
          <div className="lg:hidden flex justify-between items-end mb-4">
            <div>
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
              {verses.map((verse, index) => (
                <VerseItem
                  key={verse.id}
                  verse={verse}
                  index={index}
                  showTranslation={showTranslation}
                  onPlayClick={handlePlayClick}
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

      <VerseActionSheet
        isOpen={isAudioSheetOpen}
        onClose={() => setIsAudioSheetOpen(false)}
        verse={selectedVerseForAudio}
      />
    </>
  );
}
