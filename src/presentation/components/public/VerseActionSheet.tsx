'use client';

import React, { useEffect, useState } from 'react';
import { VerseEntity, HadiEntity, VerseMediaEntity } from '@/core/entities';
import { useHadi, useVerseMedia } from '@/presentation/hooks';
import { useAudioPlayerStore } from '@/presentation/stores/useAudioPlayerStore';
import { toArabicNumber } from '@/shared/utils/arabicText';
import { PlayIcon } from '@/presentation/components/base/icons';
import Image from 'next/image';

interface VerseActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  verse: VerseEntity | null;
}

export function VerseActionSheet({
  isOpen,
  onClose,
  verse,
}: VerseActionSheetProps) {
  const { listHadi } = useHadi();
  const { listVerseMedia } = useVerseMedia();
  const setTrack = useAudioPlayerStore((state) => state.setTrack);

  const [hadis, setHadis] = useState<HadiEntity[]>([]);
  const [selectedHadiId, setSelectedHadiId] = useState<number | null>(null);

  const [verseMedia, setVerseMedia] = useState<VerseMediaEntity[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<VerseMediaEntity | null>(
    null
  );

  const [loadingHadis, setLoadingHadis] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Load Hadis once
  useEffect(() => {
    const fetchHadis = async () => {
      setLoadingHadis(true);
      const res = await listHadi({ page: 1, limit: 100 });
      if (res.success) {
        setHadis(res.data.data);
      }
      setLoadingHadis(false);
    };
    if (isOpen) {
      fetchHadis();
    }
  }, [isOpen, listHadi]);

  // Load media whenever verse or selected Hadi changes
  useEffect(() => {
    const fetchMedia = async () => {
      if (!verse || !selectedHadiId) {
        setVerseMedia([]);
        setSelectedMedia(null);
        return;
      }
      setLoadingMedia(true);
      const res = await listVerseMedia({
        page: 1,
        limit: 50,
        verseId: verse.id,
        hadiId: selectedHadiId,
      });
      if (res.success) {
        setVerseMedia(res.data.data.filter((m) => m.mediaType === 'audio'));
      }
      setLoadingMedia(false);
    };

    fetchMedia();
  }, [verse, selectedHadiId, listVerseMedia]);

  const handlePlay = () => {
    if (!verse || !selectedHadiId || !selectedMedia) return;

    const hadi = hadis.find((h) => h.id === selectedHadiId);

    setTrack({
      verseId: verse.id,
      verseNumber: verse.verseNumber,
      chapterTitle: verse.chapter?.title || 'Unknown',
      hadiName: hadi?.name || 'Unknown',
      audioType: selectedMedia.type || 'Default',
      mediaUrl: selectedMedia.mediaUrl,
    });

    onClose();
  };

  if (!isOpen || !verse) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[600px] mx-auto bg-white rounded-t-3xl shadow-2xl z-[101] transform transition-transform duration-300 translate-y-0 pb-safe">
        <div className="p-6">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Audio Selection Hub
              </h2>
              <p className="text-sm text-slate-500">
                Personalize your recitation for {verse.chapter?.title} - Ayat{' '}
                {toArabicNumber(verse.verseNumber)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar pb-6">
            {/* Hadi Selection */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Select Qari (Hadi)
              </h3>
              {loadingHadis ? (
                <div className="animate-spin size-5 border-2 border-[#51c878] border-t-transparent rounded-full" />
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {hadis.map((hadi) => (
                    <button
                      key={hadi.id}
                      onClick={() => setSelectedHadiId(hadi.id)}
                      className={`shrink-0 w-24 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedHadiId === hadi.id
                          ? 'border-[#51c878] bg-[#51c878]/5'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="size-12 rounded-full bg-slate-100 overflow-hidden relative">
                        {hadi.imageUrl ? (
                          <Image
                            src={hadi.imageUrl}
                            alt={hadi.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-lg font-bold">
                            {hadi.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-center leading-tight line-clamp-2 text-slate-700">
                        {hadi.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Type Selection */}
            {selectedHadiId && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Recitation Style
                </h3>
                {loadingMedia ? (
                  <div className="animate-spin size-5 border-2 border-[#51c878] border-t-transparent rounded-full" />
                ) : verseMedia.length === 0 ? (
                  <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-xl">
                    No audio styles available for this Qari on this verse.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {verseMedia.map((media) => (
                      <button
                        key={media.id}
                        onClick={() => setSelectedMedia(media)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedMedia?.id === media.id
                            ? 'bg-[#51c878] text-white shadow-md shadow-[#51c878]/30'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {media.type || 'Default'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={handlePlay}
              disabled={!selectedHadiId || !selectedMedia}
              className={`w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                selectedHadiId && selectedMedia
                  ? 'bg-[#51c878] text-white hover:bg-[#3da35f] shadow-lg shadow-[#51c878]/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <PlayIcon size={20} />
              Save Selection & Play
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
