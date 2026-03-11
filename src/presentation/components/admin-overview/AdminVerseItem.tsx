'use client';

import React from 'react';
import {
  PlayIcon,
  VerseEndIcon,
  EditIcon,
  TrashIcon,
  VerseMediaIcon,
} from '@/presentation/components/base/icons';
import { VerseEntity } from '@/core/entities';
import { toArabicNumber } from '@/shared/utils/arabicText';
import { useAudioPlayerStore } from '@/presentation/stores/useAudioPlayerStore';

interface AdminVerseItemProps {
  verse: VerseEntity;
  showTranslation: boolean;
  onPlayClick?: (verse: VerseEntity) => void;
  onEdit: (verse: VerseEntity) => void;
  onDelete: (verse: VerseEntity) => void;
  onMedia: (verse: VerseEntity) => void;
}

export function AdminVerseItem({
  verse,
  showTranslation,
  onPlayClick,
  onEdit,
  onDelete,
  onMedia,
}: AdminVerseItemProps) {
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
      <div
        className={`flex gap-4 md:gap-6 ${
          !showTranslation ? 'items-center' : 'items-start'
        }`}
      >
        {/* Center Content Area */}
        <div className={`flex-1 ${showTranslation ? 'space-y-0.5' : ''}`}>
          <div className="text-right dir-rtl w-full">
            <p
              className="font-serif text-[clamp(1.5rem,4vw,2.25rem)] text-slate-800 relative inline-block text-right leading-[2em] w-full"
              style={{ lineHeight: '1.5' }}
            >
              {verse.arabicText}
            </p>
            {/* Audio progress indicator */}
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

          {/* Admin Action Bar */}
          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {verse.verseMedia && verse.verseMedia.length > 0 && (
              <button
                onClick={() => onPlayClick?.(verse)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#51c878]/10 text-[#3da35f] hover:bg-[#51c878]/20 transition-colors text-xs font-medium"
                title="Play audio"
              >
                <PlayIcon size={14} />
                <span className="hidden sm:inline">Play</span>
              </button>
            )}
            <button
              onClick={() => onEdit(verse)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-xs font-medium"
              title="Edit verse"
            >
              <EditIcon size={14} />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => onMedia(verse)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-medium"
              title="Manage media"
            >
              <VerseMediaIcon size={14} />
              <span className="hidden sm:inline">Media</span>
            </button>
            <button
              onClick={() => onDelete(verse)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-medium"
              title="Delete verse"
            >
              <TrashIcon size={14} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Right: Verse Number */}
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
        </div>
      </div>
    </div>
  );
}
