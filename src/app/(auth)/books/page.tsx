'use client';

import React, { useEffect, useCallback } from 'react';
import { BookToolbar } from '@/presentation/components/books/BookToolbar';
import { BookList, Book } from '@/presentation/components/books/BookList';
import { Pagination } from '@/presentation/components/books/Pagination';
import {
  BookForm,
  BookFormMode,
} from '@/presentation/components/books/BookForm';
import { SuccessModal, ConfirmModal } from '@/presentation/components/base';
import { useBookViewModel } from '@/presentation/view-models/book/BookViewModel';
import { BookEntity } from '@/core/entities';
import { CreateBookDTO, UpdateBookDTO } from '@/application';

/**
 * Map BookEntity to Book interface for UI component
 */
function mapBookEntityToBook(entity: BookEntity): Book {
  return {
    id: String(entity.id),
    displayId: `#${entity.id}`,
    title: entity.title,
    author: entity.author ?? '-',
    description: entity.description ?? '-',
    publishedYear: entity.publishedYear
      ? new Date(entity.publishedYear).getFullYear().toString()
      : '-',
    coverUrl: entity.coverImageUrl ?? undefined,
  };
}

export default function BooksPage() {
  const {
    isLoading,
    error,
    bookList,
    getBookList,
    setPage,
    setSearch,
    storeBook,
    updateBook,
    removeBook,
  } = useBookViewModel();

  // Fetch book list on mount
  useEffect(() => {
    getBookList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (query: string) => {
      setSearch(query);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Delay search by 500ms
      searchTimeoutRef.current = setTimeout(() => {
        getBookList(1, query);
      }, 1000);
    },
    [setSearch, getBookList]
  );

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  // Form Modal State
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<BookFormMode>('create');
  const [editingBook, setEditingBook] = React.useState<BookEntity | undefined>(
    undefined
  );

  // Success Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deleteBookId, setDeleteBookId] = React.useState<string | null>(null);

  const handleNewBook = () => {
    setFormMode('create');
    setEditingBook(undefined);
    setIsFormModalOpen(true);
  };

  // Handle submit for create
  const handleStoreBook = async (dto: CreateBookDTO): Promise<boolean> => {
    const success = await storeBook(dto);
    if (success) {
      setSuccessMessage('Buku berhasil ditambahkan ke perpustakaan.');
      setIsSuccessModalOpen(true);
    }
    return success;
  };

  // Handle submit for update
  const handleUpdateBook = async (dto: UpdateBookDTO): Promise<boolean> => {
    if (!editingBook) return false;

    const success = await updateBook(editingBook.id, dto);
    if (success) {
      setSuccessMessage('Buku berhasil diperbarui.');
      setIsSuccessModalOpen(true);
    }
    return success;
  };

  // Handle form submit (routes to create or update)
  const handleFormSubmit = async (
    dto: CreateBookDTO | UpdateBookDTO
  ): Promise<boolean> => {
    if (formMode === 'edit') {
      return handleUpdateBook(dto as UpdateBookDTO);
    }
    return handleStoreBook(dto as CreateBookDTO);
  };

  const handleEdit = (id: string) => {
    // Find the book entity from the list
    const bookEntity = bookList?.data.find((book) => String(book.id) === id);
    if (bookEntity) {
      setFormMode('edit');
      setEditingBook(bookEntity);
      setIsFormModalOpen(true);
    }
  };

  // Open delete confirmation modal
  const handleDelete = (id: string) => {
    setDeleteBookId(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (!deleteBookId) return;

    const success = await removeBook(Number.parseInt(deleteBookId));
    if (success) {
      setIsDeleteModalOpen(false);
      setDeleteBookId(null);
      setSuccessMessage('Buku berhasil dihapus.');
      setIsSuccessModalOpen(true);
    }
  };

  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      getBookList(page);
    },
    [setPage, getBookList]
  );

  // Close form modal handler
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingBook(undefined);
  };

  // Map BookEntity to Book for UI
  const books: Book[] = bookList?.data.map(mapBookEntityToBook) ?? [];
  const meta = bookList?.meta;

  return (
    <div className="min-h-screen bg-bg-main p-[clamp(1rem,2vw,2rem)] flex flex-col gap-[clamp(1.5rem,2.5vw,2.5rem)]">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-heading text-text-primary">Books Library</h1>
        <p className="text-text-secondary text-[clamp(0.875rem,1vw,1rem)]">
          Manage, edit, and organize the complete collection of books.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
        <BookToolbar
          onSearch={handleSearch}
          onFilterClick={handleFilter}
          onNewBookClick={handleNewBook}
        />

        {/* Loading State */}
        {isLoading && !bookList && (
          <div className="flex items-center justify-center py-12">
            <div className="text-text-secondary">Loading...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Book List */}
        {(!isLoading || bookList) && !error && (
          <BookList books={books} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {/* Pagination */}
        {meta && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.total_pages}
            totalEntries={meta.total}
            pageSize={meta.limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Create/Edit Book Modal */}
      {isFormModalOpen && (
        <BookForm
          isOpen={isFormModalOpen}
          onClose={handleCloseFormModal}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          mode={formMode}
          initialData={editingBook}
          error={error}
        />
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteBookId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Buku?"
        message="Apakah Anda yakin ingin menghapus buku ini? Tindakan ini tidak dapat diurangi dan akan menghapus semua data bab yang terkait."
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isLoading}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </div>
  );
}
