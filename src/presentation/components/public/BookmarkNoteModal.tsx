'use client';

import React, { useState, useEffect } from 'react';
import { VerseEntity } from '@/core/entities';
import { BookmarkIcon } from '@/presentation/components/base/icons';
import { toArabicNumber } from '@/shared/utils/arabicText';

interface BookmarkNoteModalProps {
  isOpen: boolean;
  verse: VerseEntity | null;
  onClose: () => void;
  onSubmit: (note: string) => Promise<void>;
  isLoading?: boolean;
}

export function BookmarkNoteModal({
  isOpen,
  verse,
  onClose,
  onSubmit,
  isLoading = false,
}: BookmarkNoteModalProps) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) setNote('');
  }, [isOpen]);

  if (!isOpen || !verse) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(note);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl">
          <div className="p-6">
            {/* Handle (mobile) */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5 sm:hidden" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="size-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                <BookmarkIcon size={20} filled />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Simpan Bookmark
                </h2>
                <p className="text-xs text-slate-400">
                  {verse.chapter?.title} · Ayat{' '}
                  {toArabicNumber(verse.verseNumber)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Verse preview */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-5 text-right" dir="rtl">
              <p className="font-serif text-xl text-slate-700 leading-loose line-clamp-2">
                {verse.arabicText}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Catatan <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tulis catatan untuk ayat ini..."
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#51c878]/40 focus:border-[#51c878] resize-none transition"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 rounded-2xl bg-[#51c878] text-white text-sm font-bold hover:bg-[#3da35f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#51c878]/25 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <BookmarkIcon size={14} filled />
                  )}
                  {isLoading ? 'Menyimpan...' : 'Simpan Bookmark'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
