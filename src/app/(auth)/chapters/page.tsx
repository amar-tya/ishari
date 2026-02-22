'use client';

import { useEffect, useState, useCallback } from 'react';
import { useChapterViewModel } from '@/presentation/view-models/chapter/ChapterViewModel';
import { useBookViewModel } from '@/presentation/view-models/book/BookViewModel';
import { ChapterList } from '@/presentation/components/chapter/ChapterList';
import { ChapterToolbar } from '@/presentation/components/chapter/ChapterToolbar';
import { Pagination } from '@/presentation/components/books/Pagination';
import {
  ChapterForm,
  ChapterFormMode,
} from '@/presentation/components/chapter/ChapterForm';
import { ChapterEntity } from '@/core/entities';
import { ChapterCreateRequest, ChapterUpdateRequest } from '@/application/dto';
import { SuccessModal } from '@/presentation/components/base/SuccessModal';
import { ConfirmModal } from '@/presentation/components/base/ConfirmModal';

export default function ChapterPage() {
  const {
    isLoading: isChapterLoading,
    error: chapterError,
    chapterList,
    findChapter,
    createChapter,
    updateChapter,
    deleteChapter,
    bulkDeleteChapter,
  } = useChapterViewModel();

  const { getBookList, bookList } = useBookViewModel();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<ChapterFormMode>('create');
  const [selectedChapter, setSelectedChapter] = useState<
    ChapterEntity | undefined
  >(undefined);
  const [selectedChapterIds, setSelectedChapterIds] = useState<number[]>([]);

  useEffect(() => {
    findChapter();
    getBookList(1, ''); // Fetch books for dropdown, maybe increase limit if possible or implement search in dropdown
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      findChapter({ page: 1, limit: 10, search });
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
      findChapter({ page, limit: 10, search });
    },
    [search, findChapter]
  );

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  const handleNewChapter = () => {
    setFormMode('create');
    setSelectedChapter(undefined);
    setIsModalOpen(true);
  };

  const handleEditChapter = (chapter: ChapterEntity) => {
    setFormMode('edit');
    setSelectedChapter(chapter);
    setIsModalOpen(true);
  };

  const handleDelete = (chapter: ChapterEntity) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Chapter',
      message: `Apakah Anda yakin ingin menghapus chapter "${chapter.title}"?`,
      type: 'delete',
      onConfirm: async () => {
        if (chapter.id) {
          const success = await deleteChapter(chapter.id);
          if (success) {
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            setSuccessModal({
              isOpen: true,
              title: 'Berhasil Menghapus Chapter',
              message: 'Chapter berhasil dihapus dari sistem.',
            });
          }
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedChapterIds.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: 'Hapus Chapter Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedChapterIds.length} chapter terpilih?`,
      type: 'delete',
      onConfirm: async () => {
        const success = await bulkDeleteChapter(selectedChapterIds);
        if (success) {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          setSuccessModal({
            isOpen: true,
            title: 'Berhasil Menghapus Chapter',
            message: `${selectedChapterIds.length} chapter berhasil dihapus dari sistem.`,
          });
          setSelectedChapterIds([]);
        }
      },
    });
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedChapterIds(ids);
  };

  const handleFormSubmit = async (
    data: ChapterCreateRequest | ChapterUpdateRequest
  ) => {
    if (formMode === 'create') {
      const success = await createChapter(data as ChapterCreateRequest);
      if (success) {
        setIsModalOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Membuat Chapter',
          message: 'Chapter baru berhasil ditambahkan ke dalam sistem.',
        });
      }
      return success;
    } else {
      // The form already includes chapterId in edit mode
      const success = await updateChapter(data as ChapterUpdateRequest);
      if (success) {
        setIsModalOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Update Chapter',
          message: 'Data chapter berhasil diperbarui.',
        });
      }
      return success;
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-bg-main p-[clamp(1rem,2vw,2rem)] flex flex-col gap-[clamp(1.5rem,2.5vw,2.5rem)]">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[clamp(1.5rem,2.5vw,2rem)] font-bold text-primary">
          Chapters Library
        </h1>
        <p className="text-text-secondary text-[clamp(0.875rem,1vw,1rem)]">
          Manage, edit, and organize the complete collection of book chapters.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
        <ChapterToolbar
          onSearch={handleSearch}
          onFilterClick={handleFilter}
          onNewChapterClick={handleNewChapter}
          onBulkDeleteClick={handleBulkDelete}
        />

        {/* Loading State */}
        {isChapterLoading && !chapterList && (
          <div className="flex items-center justify-center py-12">
            <div className="text-text-secondary">Loading...</div>
          </div>
        )}

        {/* Error State */}
        {chapterError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {chapterError}
          </div>
        )}

        {/* Chapter List */}
        {(!isChapterLoading || chapterList) && !chapterError && (
          <ChapterList
            chapters={chapterList?.data || []}
            onEdit={handleEditChapter}
            onDelete={handleDelete}
            selectedIds={selectedChapterIds}
            onSelectionChange={handleSelectionChange}
          />
        )}

        {/* Pagination */}
        {chapterList && chapterList.meta && (
          <Pagination
            currentPage={chapterList.meta.page}
            totalPages={chapterList.meta.totalPages}
            totalEntries={chapterList.meta.total}
            pageSize={chapterList.meta.limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <ChapterForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          isLoading={isChapterLoading}
          mode={formMode}
          initialData={selectedChapter}
          books={bookList?.data || []}
          error={chapterError}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={handleCloseSuccessModal}
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
        isLoading={isChapterLoading}
        variant="danger"
      />
    </div>
  );
}
