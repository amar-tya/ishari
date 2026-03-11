'use client';

import React from 'react';
import {
  PlayIcon,
  VerseEndIcon,
  BookmarkIcon,
} from '@/presentation/components/base/icons';
import { VerseEntity } from '@/core/entities';
import { toArabicNumber } from '@/shared/utils/arabicText';
import { useAudioPlayerStore } from '@/presentation/stores/useAudioPlayerStore';

interface VerseItemProps {
  verse: VerseEntity;
  showTranslation: boolean;
  onPlayClick?: (verse: VerseEntity) => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (verse: VerseEntity) => void;
  isUser?: boolean;
}

export function VerseItem({
  verse,
  showTranslation,
  onPlayClick,
  isBookmarked = false,
  onBookmarkToggle,
  isUser = false,
}: VerseItemProps) {
  const currentTrack = useAudioPlayerStore((state) => state.currentTrack);
  const globalProgress = useAudioPlayerStore((state) => state.progress);

  const isPlayingThisVerse = currentTrack?.verseId === verse.id;
  const progress = isPlayingThisVerse ? globalProgress : 0;

  return (
    <div
      className={`group relative hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0 ${
        showTranslation ? 'p-6 md:p-8' : 'p-4 md:p-6'
      }`}
    >
      {/* Bookmark corner triangle (top-right) */}
      {isUser && (
        <button
          onClick={() => onBookmarkToggle?.(verse)}
          title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}
          className="absolute top-0 right-0 w-10 h-10 cursor-pointer"
        >
          <BookmarkIcon
            size={16}
            filled={isBookmarked}
            className={`absolute top-1 right-1 transition-colors duration-200 pointer-events-none ${
              isBookmarked
                ? 'text-[#51c878]'
                : 'text-[#51c878] opacity-40 group-hover:opacity-80'
            }`}
          />
        </button>
      )}

      <div
        className={`flex gap-4 md:gap-6 ${
          !showTranslation ? 'items-center' : 'items-start'
        }`}
      >
        {/* Left Action Menu */}
        {/* <div className="shrink-0 pt-1 flex flex-col items-center gap-4">
          <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100 outline-none">
            <MoreVerticalIcon size={20} />
          </button>
        </div> */}

        {/* Center Content Area */}
        <div className={`flex-1 ${showTranslation ? 'space-y-0.5' : ''}`}>
          <div className="text-right dir-rtl w-full">
            <p
              className="font-serif text-[clamp(1.5rem,4vw,2.25rem)] text-slate-800 relative inline-block text-right leading-[2em] w-full"
              style={{ lineHeight: '1.5' }}
            >
              {verse.arabicText}
            </p>
            {/* Audio Indicator */}
            {progress > 0 && (
              <div className="w-full h-[3px] bg-[#e6f7eb] rounded-full mt-4 md:mt-6 relative">
                <div
                  className="absolute top-0 right-0 h-full bg-[#51c878] rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
          {showTranslation && (
            <div className="pt-2">
              <p className="text-slate-600 text-[clamp(0.875rem,1.5vw,1rem)] leading-relaxed font-normal">
                {verse.transliteration ||
                  'Sistem belum memuat transliterasi untuk ayat ini.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Action/Number Area */}
        <div
          className={`shrink-0 flex flex-col gap-2 items-center ${
            showTranslation ? 'pt-2' : ''
          }`}
        >
          <div className="relative flex items-center justify-center size-9 mb-2 text-[#51c878]">
            <VerseEndIcon size={36} className="absolute inset-0" />
            <span className="font-serif text-[11px] font-bold mt-0.5 z-10 w-fit h-fit text-center">
              {toArabicNumber(verse.verseNumber)}
            </span>
          </div>
          {verse.verseMedia && verse.verseMedia.length > 0 && (
            <div className="relative group/audio">
              <button
                onClick={() => onPlayClick && onPlayClick(verse)}
                className="size-6 rounded-xl bg-white border shadow-md text-[#51c878] hover:text-[#3da35f] hover:shadow-none hover:bg-slate-100 transition-all flex items-center justify-center"
              >
                <PlayIcon size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
