'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useBookmarkViewModel } from '@/presentation/view-models/bookmark/BookmarkViewModel';
import { useUserViewModel } from '@/presentation/view-models/user/UserViewModel';
import {
  BookmarkList,
  BookmarkToolbar,
  BookmarkForm,
  BookmarkFilter,
} from '@/presentation/components/bookmark';
import { Pagination } from '@/presentation/components/books/Pagination';
import { BookmarkEntity } from '@/core/entities';
import {
  BookmarkCreateRequest,
  BookmarkUpdateRequest,
} from '@/application/dto';
import { SuccessModal } from '@/presentation/components/base/SuccessModal';
import { ConfirmModal } from '@/presentation/components/base/ConfirmModal';

export default function BookmarksPage() {
  const {
    isLoading: isBookmarkLoading,
    error: bookmarkError,
    bookmarkList,
    findBookmark,
    createBookmark,
    updateBookmark,
    deleteBookmark,
  } = useBookmarkViewModel();

  const { userList, findUser } = useUserViewModel();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedBookmark, setSelectedBookmark] = useState<
    BookmarkEntity | undefined
  >(undefined);
  const [selectedBookmarkIds, setSelectedBookmarkIds] = useState<number[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{ search?: string }>({});
  const isFirstRender = useRef(true);

  useEffect(() => {
    findBookmark();
    findUser({ limit: 1000 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      findBookmark({ page: 1, limit: 10, search, ...activeFilter });
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
      findBookmark({ page, limit: 10, search, ...activeFilter });
    },
    [search, activeFilter, findBookmark]
  );

  const handleApplyFilter = (filter: { search?: string }) => {
    setActiveFilter(filter);
    findBookmark({ page: 1, limit: 10, search, ...filter });
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleNewBookmark = () => {
    setFormMode('create');
    setSelectedBookmark(undefined);
    setIsModalOpen(true);
  };

  const handleEditBookmark = (bookmark: BookmarkEntity) => {
    setFormMode('edit');
    setSelectedBookmark(bookmark);
    setIsModalOpen(true);
  };

  const handleDelete = (bookmark: BookmarkEntity) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Bookmark',
      message: `Apakah Anda yakin ingin menghapus bookmark ID ${bookmark.id}?`,
      type: 'delete',
      onConfirm: async () => {
        if (bookmark.id) {
          const success = await deleteBookmark(bookmark.id);
          if (success) {
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            setSuccessModal({
              isOpen: true,
              title: 'Berhasil Menghapus Bookmark',
              message: 'Bookmark berhasil dihapus dari sistem.',
            });
          }
        }
      },
    });
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedBookmarkIds(ids);
  };

  const handleFormSubmit = async (
    data: BookmarkCreateRequest | BookmarkUpdateRequest
  ) => {
    if (formMode === 'create') {
      const success = await createBookmark(data as BookmarkCreateRequest);
      if (success) {
        setIsModalOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Membuat Bookmark',
          message: 'Bookmark baru berhasil ditambahkan ke dalam sistem.',
        });
      }
      return success;
    } else {
      const success = await updateBookmark(data as BookmarkUpdateRequest);
      if (success) {
        setIsModalOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Update Bookmark',
          message: 'Data bookmark berhasil diperbarui.',
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
          Bookmarks Library
        </h1>
        <p className="text-text-secondary text-[clamp(0.875rem,1vw,1rem)]">
          Kelola, edit, dan organisir collection dari bookmark yang ada.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="flex flex-col gap-[clamp(1.5rem,2vw,2rem)]">
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          <BookmarkToolbar
            onSearch={handleSearch}
            onFilterClick={handleFilter}
            onNewBookmarkClick={handleNewBookmark}
          />

          {/* Loading State */}
          {isBookmarkLoading && !bookmarkList && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error State */}
          {bookmarkError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {bookmarkError}
            </div>
          )}

          {/* Bookmark List */}
          {(!isBookmarkLoading || bookmarkList) && !bookmarkError && (
            <BookmarkList
              bookmarks={bookmarkList?.data || []}
              onEdit={handleEditBookmark}
              onDelete={handleDelete}
              selectedIds={selectedBookmarkIds}
              onSelectionChange={handleSelectionChange}
            />
          )}

          {/* Pagination */}
          {bookmarkList?.meta && (
            <Pagination
              currentPage={bookmarkList.meta.page}
              totalPages={bookmarkList.meta.totalPages}
              totalEntries={bookmarkList.meta.total}
              pageSize={bookmarkList.meta.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <BookmarkForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          isLoading={isBookmarkLoading}
          mode={formMode}
          initialData={selectedBookmark}
          error={bookmarkError}
        />
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <BookmarkFilter
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilter}
          initialFilter={activeFilter}
          users={userList?.data || []}
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
        isLoading={isBookmarkLoading}
        variant="danger"
      />
    </div>
  );
}
