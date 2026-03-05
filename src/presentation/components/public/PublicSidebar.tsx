'use client';

import React from 'react';
import {
  SparklesIcon,
  PlayCircleIcon,
  TranslationsIcon,
} from '@/presentation/components/base/icons';
import { ChapterEntity, VerseMediaEntity } from '@/core/entities';
import { useVerseMedia } from '@/presentation/hooks/useVerseMedia';
import { useAudioPlayerStore } from '@/presentation/stores/useAudioPlayerStore';

interface PublicSidebarProps {
  chapter: ChapterEntity | null;
  showTranslation: boolean;
  setShowTranslation: (show: boolean) => void;
}

export function PublicSidebar({
  chapter,
  showTranslation,
  setShowTranslation,
}: PublicSidebarProps) {
  const { getRandomVerseMedia } = useVerseMedia();
  const { setTrack } = useAudioPlayerStore();
  const [suggestion, setSuggestion] = React.useState<VerseMediaEntity | null>(
    null as VerseMediaEntity | null
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchSuggestion() {
      setLoading(true);
      const result = await getRandomVerseMedia();
      if (result.success) {
        setSuggestion(result.data);
      }
      setLoading(false);
    }
    fetchSuggestion();
  }, [getRandomVerseMedia]);

  const handlePlaySuggestion = () => {
    if (suggestion && suggestion.verse && suggestion.mediaUrl) {
      setTrack({
        verseId: suggestion.verse.id,
        verseNumber: suggestion.verse.verseNumber,
        chapterTitle: suggestion.verse.chapter?.title || 'Unknown',
        hadiName: suggestion.hadi?.name || 'Unknown',
        audioType: suggestion.type || 'Default',
        mediaUrl: suggestion.mediaUrl,
      });
    }
  };

  return (
    <aside className="hidden lg:block lg:col-span-3 space-y-6">
      <div className="sticky top-28">
        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(81,200,120,0.1),-4px_-4px_10px_rgba(255,255,255,0.8)] border border-slate-50 mb-6">
          <span className="inline-flex items-center justify-center px-3 py-1 bg-[#e6f7ec] text-[#3da35f] text-xs font-bold rounded-full mb-3">
            {chapter?.category || 'Meccan'}
          </span>
          <h1 className="text-[clamp(1.125rem,2.5vw,1.5rem)] font-bold text-[#1e293b] mb-1">
            {chapter?.title || 'Unknown Surah'}
          </h1>
          <p className="text-[#475569] text-sm mb-4">
            {chapter?.title || 'Unknown'} • {chapter?.totalVerses || 0} Verses
          </p>
          {/* <button className="w-full h-12 bg-[#51c878] hover:bg-[#3da35f] text-white rounded-xl shadow-lg shadow-[#51c878]/30 flex items-center justify-center gap-2 transition-all font-semibold active:scale-95 mb-3">
            <PlayIcon size={24} />
            Play Full Surah
          </button> */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`w-full h-12 flex items-center justify-center gap-2 rounded-xl transition-all font-semibold border ${
              showTranslation
                ? 'bg-white border-[#51c878] text-[#51c878] hover:bg-[#e6f7ec]'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <TranslationsIcon size={20} />
            {showTranslation ? 'Hide Translation' : 'Show Translation'}
          </button>
        </div>

        {/* Smart Suggestion */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 size-24 bg-[#51c878]/20 rounded-full blur-2xl group-hover:bg-[#51c878]/30 transition-all"></div>
          <div className="flex items-center gap-2 mb-3 text-[#3da35f]">
            <SparklesIcon size={18} className="text-[#51c878]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#51c878]">
              Smart Suggest
            </span>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-14 bg-white/10 rounded-lg w-full"></div>
            </div>
          ) : suggestion ? (
            <>
              <h3 className="font-bold text-lg mb-2">
                {suggestion.verse?.chapter?.title || 'Beautiful Verse'}
              </h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-2">
                Verse {suggestion.verse?.verseNumber}:{' '}
                {suggestion.verse?.transliteration || 'Reading suggestion...'}
              </p>
              <div
                onClick={handlePlaySuggestion}
                className="flex items-center gap-3 bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/5 cursor-pointer hover:bg-white/20 transition-all"
              >
                <div
                  className="size-10 rounded-full bg-cover bg-center bg-slate-700 flex items-center justify-center text-[#51c878]"
                  style={
                    suggestion.hadi?.imageUrl
                      ? {
                          backgroundImage: `url('${suggestion.hadi.imageUrl}')`,
                        }
                      : {}
                  }
                >
                  {!suggestion.hadi?.imageUrl && <PlayCircleIcon size={24} />}
                </div>
                <div>
                  <p className="text-sm font-semibold truncate max-w-[120px]">
                    {suggestion.hadi?.name || 'Unknown Qari'}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {suggestion.type || 'Recitation'}
                  </p>
                </div>
                <PlayCircleIcon size={24} className="ml-auto text-[#51c878]" />
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-sm italic">
              No suggestions available at the moment.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
