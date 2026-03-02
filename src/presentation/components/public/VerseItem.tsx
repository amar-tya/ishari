'use client';

import React from 'react';
import {
  PlayIcon,
  MicIcon,
  GraphicEqIcon,
  BookmarkIcon,
  ShareIcon,
  VerseEndIcon,
  MoreVerticalIcon,
} from '@/presentation/components/base/icons';
import { VerseEntity } from '@/core/entities';
import { toArabicNumber } from '@/shared/utils/arabicText';

interface VerseItemProps {
  verse: VerseEntity;
  index: number;
  showTranslation: boolean;
}

export function VerseItem({ verse, index, showTranslation }: VerseItemProps) {
  // Mock progress for demonstration purposes
  const progress = index === 0 ? 35 : 0;

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
          </div>
          {showTranslation && (
            <div className="pt-2">
              <p className="text-slate-600 text-[clamp(0.875rem,1.5vw,1rem)] leading-relaxed font-normal">
                {verse.transliteration ||
                  'Sistem belum memuat terjemahan untuk ayat ini.'}
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
          {/* <div className="relative group/audio">
            <button className="size-6 rounded-xl bg-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] text-[#51c878] hover:text-[#3da35f] hover:shadow-none hover:bg-slate-100 transition-all flex items-center justify-center">
              <PlayIcon size={12} />
            </button>
          </div>
          <button className="size-6 rounded-xl bg-transparent hover:bg-slate-100 text-slate-400 hover:text-[#51c878] transition-all flex items-center justify-center">
            <BookmarkIcon size={12} />
          </button>
          <button className="size-6 rounded-xl bg-transparent hover:bg-slate-100 text-slate-400 hover:text-[#51c878] transition-all flex items-center justify-center">
            <ShareIcon size={12} />
          </button> */}
        </div>
      </div>
    </div>
  );
}
