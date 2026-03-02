'use client';

import React from 'react';
import {
  PlayIcon,
  MicIcon,
  GraphicEqIcon,
  BookmarkIcon,
  ShareIcon,
  VerseEndIcon,
} from '@/presentation/components/base/icons';
import { VerseEntity } from '@/core/entities';
import { toArabicNumber } from '@/shared/utils/arabicText';

interface VerseItemProps {
  verse: VerseEntity;
  index: number;
}

export function VerseItem({ verse, index }: VerseItemProps) {
  // Mock progress for demonstration purposes
  const progress = index === 0 ? 35 : 0;

  return (
    <div className="group relative bg-white hover:bg-slate-50 transition-colors rounded-2xl p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100">
      <div className="flex gap-4 md:gap-8">
        <div className="flex-1 space-y-6">
          <div className="text-right dir-rtl w-full">
            <p className="font-serif text-4xl md:text-5xl leading-[2.2] text-slate-800 relative inline-block">
              {progress > 0 && (
                <>
                  <span className="absolute bottom-0 right-0 h-1 bg-[#51c878]/20 w-full rounded-full"></span>
                  <span
                    className="absolute bottom-0 right-0 h-1 bg-[#51c878] rounded-full shadow-[0_0_10px_rgba(81,200,120,0.5)] z-10"
                    style={{ width: `${progress}%` }}
                  ></span>
                </>
              )}
              {verse.arabicText}
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <p className="text-slate-500 text-base leading-relaxed font-normal">
              {/* Optional: if you have translation, render it here */}
              {verse.transliteration ||
                'Sistem belum memuat terjemahan untuk ayat ini.'}
            </p>
          </div>
        </div>
        <div className="shrink-0 flex flex-col gap-2 pt-2 items-center">
          <div className="relative flex items-center justify-center size-9 mb-2 text-[#51c878]">
            <VerseEndIcon size={36} className="absolute inset-0" />
            <span className="font-serif text-xs font-bold mt-0.5 z-10 w-fit h-fit text-center">
              {toArabicNumber(verse.verseNumber)}
            </span>
          </div>
          <div className="relative group/audio">
            {/* <button className="size-10 rounded-xl bg-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] text-[#51c878] hover:text-[#3da35f] hover:shadow-none hover:bg-slate-100 transition-all flex items-center justify-center">
              <PlayIcon size={24} />
            </button>
            {index === 0 && (
              <div className="hidden group-hover/audio:block absolute right-12 top-0 z-20 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 animate-fade-in origin-top-right">
                <div className="text-xs font-bold text-slate-400 px-2 py-1 mb-1">
                  SELECT AUDIO
                </div>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#e6f7ec] flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <MicIcon size={16} className="text-[#51c878]" /> Mishary
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#e6f7ec] flex items-center gap-2 text-sm text-slate-700">
                  <MicIcon size={16} className="text-slate-400" /> Al-Ghamidi
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#e6f7ec] flex items-center gap-2 text-sm text-slate-700">
                  <GraphicEqIcon size={16} className="text-purple-400" /> AI
                  Voice
                </button>
              </div>
            )} */}
          </div>
          <button className="size-10 rounded-xl bg-transparent hover:bg-slate-100 text-slate-400 hover:text-[#51c878] transition-all flex items-center justify-center">
            {/* <BookmarkIcon size={20} /> */}
          </button>
          <button className="size-10 rounded-xl bg-transparent hover:bg-slate-100 text-slate-400 hover:text-[#51c878] transition-all flex items-center justify-center">
            {/* <ShareIcon size={20} /> */}
          </button>
        </div>
      </div>
    </div>
  );
}
