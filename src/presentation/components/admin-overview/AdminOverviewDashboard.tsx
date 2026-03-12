'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerse, useChapter } from '@/presentation/hooks';
import { useVerseViewModel } from '@/presentation/view-models/verse/VerseViewModel';
import { VerseEntity, ChapterEntity } from '@/core/entities';
import { VerseCreateRequest, VerseUpdateRequest } from '@/application/dto';
import { AdminVerseItem } from './AdminVerseItem';
import { PublicAudioPlayer } from '@/presentation/components/public/PublicAudioPlayer';
import { VerseActionSheet } from '@/presentation/components/public/VerseActionSheet';
import { ChapterSelectionModal } from '@/presentation/components/public/ChapterSelectionModal';
import {
  VerseForm,
  VerseMediaManageModal,
} from '@/presentation/components/verse';
import { SuccessModal } from '@/presentation/components/base/SuccessModal';
import { ConfirmModal } from '@/presentation/components/base/ConfirmModal';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TranslationsIcon,
  PlusIcon,
} from '@/presentation/components/base/icons';
import { useChapterViewModel } from '@/presentation/view-models/chapter/ChapterViewModel';

export function AdminOverviewDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get('id');
  const chapterId = idParam ? parseInt(idParam, 10) : 1;

  const { findVerse } = useVerse();
  const { findChapter } = useChapter();
  const { findChapter: findChapterList, chapterList } = useChapterViewModel();

  const {
    isLoading: isVerseLoading,
    error: verseError,
    createVerse,
    updateVerse,
    deleteVerse,
  } = useVerseViewModel();

  const [chapter, setChapter] = useState<ChapterEntity | null>(null);
  const [verses, setVerses] = useState<VerseEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Audio sheet
  const [selectedVerseForAudio, setSelectedVerseForAudio] =
    useState<VerseEntity | null>(null);
  const [isAudioSheetOpen, setIsAudioSheetOpen] = useState(false);

  // Chapter modal (mobile)
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  // Verse Form modal (create/edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedVerse, setSelectedVerse] = useState<VerseEntity | undefined>(
    undefined
  );

  // Verse Media modal
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedVerseForMedia, setSelectedVerseForMedia] = useState<
    VerseEntity | undefined
  >(undefined);

  // Feedback modals
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  });

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch chapter + verses on chapterId / page change
  const fetchVerses = useCallback(
    async (page = 1) => {
      setLoading(true);
      setVerses([]);
      try {
        const [chapterRes, versesRes] = await Promise.all([
          findChapter({ page: 1, limit: 1, chapterId }),
          findVerse({ page, limit: 30, chapterId }),
        ]);
        if (!isMounted.current) return;
        if (chapterRes.success && chapterRes.data.data.length > 0) {
          setChapter(chapterRes.data.data[0]);
        }
        if (versesRes.success) {
          setVerses(versesRes.data.data);
          setTotalPages(versesRes.data.meta.totalPages);
          setCurrentPage(versesRes.data.meta.page);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
    [chapterId, findChapter, findVerse]
  );

  useEffect(() => {
    fetchVerses(1);
    findChapterList({ page: 1, limit: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  const handleChapterSelect = (selectedChapterId: number) => {
    router.push(`/overview-verses?id=${selectedChapterId}`);
  };

  const handlePlayClick = (verse: VerseEntity) => {
    setSelectedVerseForAudio(verse);
    setIsAudioSheetOpen(true);
  };

  const handleAddVerse = () => {
    setFormMode('create');
    setSelectedVerse(undefined);
    setIsFormOpen(true);
  };

  const handleEditVerse = (verse: VerseEntity) => {
    setFormMode('edit');
    setSelectedVerse(verse);
    setIsFormOpen(true);
  };

  const handleDeleteVerse = (verse: VerseEntity) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Verse',
      message: `Apakah Anda yakin ingin menghapus verse #${verse.verseNumber}?`,
      onConfirm: async () => {
        if (!verse.id) return;
        const ok = await deleteVerse(verse.id);
        if (ok) {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          setSuccessModal({
            isOpen: true,
            title: 'Verse Dihapus',
            message: 'Verse berhasil dihapus dari sistem.',
          });
          fetchVerses(currentPage);
        }
      },
    });
  };

  const handleMediaVerse = (verse: VerseEntity) => {
    setSelectedVerseForMedia(verse);
    setIsMediaModalOpen(true);
  };

  const handleFormSubmit = async (
    data: VerseCreateRequest | VerseUpdateRequest
  ) => {
    if (formMode === 'create') {
      const ok = await createVerse(data as VerseCreateRequest);
      if (ok) {
        setIsFormOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Verse Dibuat',
          message: 'Verse baru berhasil ditambahkan.',
        });
        fetchVerses(currentPage);
      }
      return ok;
    } else {
      const ok = await updateVerse(data as VerseUpdateRequest);
      if (ok) {
        setIsFormOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Verse Diperbarui',
          message: 'Data verse berhasil diperbarui.',
        });
        fetchVerses(currentPage);
      }
      return ok;
    }
  };

  return (
    <>
      <main className="flex-1 w-full max-w-350 mx-auto p-6 grid grid-cols-1 gap-8">
        {/* Chapter & Controls Bar */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsChapterModalOpen(true)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group"
            >
              <div className="text-left">
                <h1 className="text-[clamp(1.25rem,4vw,1.75rem)] font-bold text-[#1e293b] leading-tight">
                  {chapter?.title || 'Loading...'}
                </h1>
                <p className="text-sm text-[#475569]">
                  {chapter?.category || 'Meccan'} • {chapter?.totalVerses || 0}{' '}
                  Verses
                </p>
              </div>
              <ChevronDownIcon
                size={20}
                className="text-slate-400 group-hover:text-[#51c878] transition-colors mt-0.5 shrink-0"
              />
            </button>
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

          {/* Admin Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Overview Verses
              </h2>
              <p className="text-sm text-slate-500">
                {chapter?.title
                  ? `${chapter.title} — ${chapter.totalVerses} ayat`
                  : 'Pilih chapter dari sidebar'}
              </p>
            </div>
            <button
              onClick={handleAddVerse}
              className="flex items-center gap-2 px-4 py-2 bg-[#51c878] text-white rounded-xl font-semibold text-sm hover:bg-[#3da35f] transition-colors shadow-md shadow-[#51c878]/30 active:scale-95"
            >
              <PlusIcon size={16} />
              Add Verse
            </button>
          </div>

          {/* Error */}
          {verseError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {verseError}
            </div>
          )}

          {/* Verse List */}
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
              {verses.map((verse) => (
                <AdminVerseItem
                  key={verse.id}
                  verse={verse}
                  showTranslation={showTranslation}
                  onPlayClick={handlePlayClick}
                  onEdit={handleEditVerse}
                  onDelete={handleDeleteVerse}
                  onMedia={handleMediaVerse}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 pb-12">
              <div className="flex gap-2 items-center bg-white p-2 rounded-2xl shadow-[4px_4px_10px_rgba(81,200,120,0.1),-4px_-4px_10px_rgba(255,255,255,0.8)]">
                <button
                  onClick={() => fetchVerses(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="size-10 flex items-center justify-center hover:bg-slate-100 rounded-xl text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon size={24} />
                </button>
                <div className="px-4 font-semibold text-[#1e293b] text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => fetchVerses(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="size-10 flex items-center justify-center bg-[#51c878] text-white rounded-xl shadow-lg shadow-[#51c878]/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon size={24} />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Audio Player */}
      <PublicAudioPlayer />

      {/* Audio Sheet */}
      <VerseActionSheet
        isOpen={isAudioSheetOpen}
        onClose={() => setIsAudioSheetOpen(false)}
        verse={selectedVerseForAudio}
      />

      {/* Chapter Modal (mobile) */}
      <ChapterSelectionModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        onSelect={handleChapterSelect}
        currentChapterId={chapterId}
      />

      {/* Verse Form Modal */}
      {isFormOpen && (
        <VerseForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          isLoading={isVerseLoading}
          mode={formMode}
          initialData={selectedVerse}
          chapters={chapterList?.data || []}
          error={verseError}
        />
      )}

      {/* Verse Media Modal */}
      {selectedVerseForMedia && (
        <VerseMediaManageModal
          verse={selectedVerseForMedia}
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        isLoading={isVerseLoading}
        variant="danger"
      />
    </>
  );
}
