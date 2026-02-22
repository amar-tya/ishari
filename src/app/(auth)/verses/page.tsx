'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useVerseViewModel } from '@/presentation/view-models/verse/VerseViewModel';
import { useChapterViewModel } from '@/presentation/view-models/chapter/ChapterViewModel';
import {
  VerseList,
  VerseToolbar,
  VerseForm,
  VerseFilter,
} from '@/presentation/components/verse';
import { Pagination } from '@/presentation/components/books/Pagination';
import { VerseEntity } from '@/core/entities';
import { VerseCreateRequest, VerseUpdateRequest } from '@/application/dto';
import { SuccessModal } from '@/presentation/components/base/SuccessModal';
import { ConfirmModal } from '@/presentation/components/base/ConfirmModal';

export default function VersesPage() {
  const {
    isLoading: isVerseLoading,
    error: verseError,
    verseList,
    findVerse,
    createVerse,
    updateVerse,
    deleteVerse,
    bulkDeleteVerse,
  } = useVerseViewModel();

  const { findChapter, chapterList } = useChapterViewModel();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedVerse, setSelectedVerse] = useState<VerseEntity | undefined>(
    undefined
  );
  const [selectedVerseIds, setSelectedVerseIds] = useState<number[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{
    chapterId?: number;
    arabicText?: string;
    transliteration?: string;
  }>({});
  const isFirstRender = useRef(true);

  useEffect(() => {
    findVerse();
    findChapter({ page: 1, limit: 100 }); // Fetch chapters for dropdown
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      findVerse({ page: 1, limit: 10, search, ...activeFilter });
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeFilter]);

  // Success Modal State
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'delete' as 'delete' | 'confirm',
    onConfirm: async () => {},
  });

  const handlePageChange = useCallback(
    (page: number) => {
      findVerse({ page, limit: 10, search, ...activeFilter });
    },
    [search, activeFilter, findVerse]
  );

  const handleApplyFilter = (filter: {
    chapterId?: number;
    arabicText?: string;
    transliteration?: string;
  }) => {
    setActiveFilter(filter);
    findVerse({ page: 1, limit: 10, search, ...filter });
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleNewVerse = () => {
    setFormMode('create');
    setSelectedVerse(undefined);
    setIsModalOpen(true);
  };

  const handleEditVerse = (verse: VerseEntity) => {
    setFormMode('edit');
    setSelectedVerse(verse);
    setIsModalOpen(true);
  };

  const handleDelete = (verse: VerseEntity) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Verse',
      message: `Apakah Anda yakin ingin menghapus verse dengan ID ${verse.id}?`,
      type: 'delete',
      onConfirm: async () => {
        if (verse.id) {
          const success = await deleteVerse(verse.id);
          if (success) {
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            setSuccessModal({
              isOpen: true,
              title: 'Berhasil Menghapus Verse',
              message: 'Verse berhasil dihapus dari sistem.',
            });
          }
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedVerseIds.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: 'Hapus Verse Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedVerseIds.length} verse terpilih?`,
      type: 'delete',
      onConfirm: async () => {
        const success = await bulkDeleteVerse(selectedVerseIds);
        if (success) {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          setSuccessModal({
            isOpen: true,
            title: 'Berhasil Menghapus Verse',
            message: `${selectedVerseIds.length} verse berhasil dihapus dari sistem.`,
          });
          setSelectedVerseIds([]);
        }
      },
    });
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedVerseIds(ids);
  };

  const handleFormSubmit = async (
    data: VerseCreateRequest | VerseUpdateRequest
  ) => {
    if (formMode === 'create') {
      const success = await createVerse(data as VerseCreateRequest);
      if (success) {
        setIsModalOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Membuat Verse',
          message: 'Verse baru berhasil ditambahkan ke dalam sistem.',
        });
      }
      return success;
    } else {
      const success = await updateVerse(data as VerseUpdateRequest);
      if (success) {
        setIsModalOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Update Verse',
          message: 'Data verse berhasil diperbarui.',
        });
      }
      return success;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-[clamp(1rem,2vw,2rem)] flex flex-col gap-[clamp(1.5rem,2.5vw,2.5rem)]">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[clamp(1.5rem,2.5vw,2rem)] font-bold text-primary">
          Verses Library
        </h1>
        <p className="text-text-secondary text-[clamp(0.875rem,1vw,1rem)]">
          Manage, edit, and organize the complete collection of book verses.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="flex flex-col gap-[clamp(1.5rem,2vw,2rem)]">
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          <VerseToolbar
            onSearch={handleSearch}
            onFilterClick={handleFilter}
            onNewVerseClick={handleNewVerse}
            onBulkDeleteClick={handleBulkDelete}
          />

          {/* Loading State */}
          {isVerseLoading && !verseList && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error State */}
          {verseError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {verseError}
            </div>
          )}

          {/* Verse List */}
          {(!isVerseLoading || verseList) && !verseError && (
            <VerseList
              verses={verseList?.data || []}
              onEdit={handleEditVerse}
              onDelete={handleDelete}
              selectedIds={selectedVerseIds}
              onSelectionChange={handleSelectionChange}
            />
          )}

          {/* Pagination */}
          {verseList?.meta && (
            <Pagination
              currentPage={verseList.meta.page}
              totalPages={verseList.meta.totalPages}
              totalEntries={verseList.meta.total}
              pageSize={verseList.meta.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <VerseForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          isLoading={isVerseLoading}
          mode={formMode}
          initialData={selectedVerse}
          chapters={chapterList?.data || []}
          error={verseError}
        />
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <VerseFilter
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilter}
          chapters={chapterList?.data || []}
          initialFilter={activeFilter}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        isLoading={isVerseLoading}
        variant="danger"
      />
    </div>
  );
}
