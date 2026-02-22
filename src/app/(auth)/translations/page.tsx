'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslationViewModel } from '@/presentation/view-models/translation/TranslationViewModel';
import {
  TranslationList,
  TranslationToolbar,
  TranslationForm,
  TranslationFilter,
} from '@/presentation/components/translation';
import { Pagination } from '@/presentation/components/books/Pagination';
import { TranslationEntity } from '@/core/entities';
import {
  TranslationCreateRequest,
  TranslationUpdateRequest,
} from '@/application/dto';
import { SuccessModal } from '@/presentation/components/base/SuccessModal';
import { ConfirmModal } from '@/presentation/components/base/ConfirmModal';

export default function TranslationsPage() {
  const {
    isLoading: isTranslationLoading,
    error: translationError,
    translationList,
    findTranslation,
    createTranslation,
    updateTranslation,
    deleteTranslation,
    bulkDeleteTranslation,
    dropdownOptions,
    fetchDropdownOptions,
  } = useTranslationViewModel();

  // Verse fetch removed since we get verses from translation dropdown now

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedTranslation, setSelectedTranslation] = useState<
    TranslationEntity | undefined
  >(undefined); // Used previously as TranslationEntity
  const [selectedTranslationIds, setSelectedTranslationIds] = useState<
    number[]
  >([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{
    verseId?: number;
    translator?: string;
    languageCode?: string;
  }>({});
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    findTranslation();
    fetchDropdownOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      findTranslation({ page: 1, limit: 10, search, ...activeFilter });
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
      findTranslation({ page, limit: 10, search, ...activeFilter });
    },
    [search, activeFilter, findTranslation]
  );

  const handleApplyFilter = (filter: {
    verseId?: number;
    translator?: string;
    languageCode?: string;
  }) => {
    setActiveFilter(filter);
    findTranslation({ page: 1, limit: 10, search, ...filter });
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleNewTranslation = () => {
    setFormMode('create');
    setSelectedTranslation(undefined);
    setIsModalOpen(true);
  };

  const handleEditTranslation = (translation: TranslationEntity) => {
    setFormMode('edit');
    setSelectedTranslation(translation);
    setIsModalOpen(true);
  };

  const handleDelete = (translation: TranslationEntity) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Terjemahan',
      message: `Apakah Anda yakin ingin menghapus terjemahan dengan ID ${translation.id}?`,
      type: 'delete',
      onConfirm: async () => {
        const success = await deleteTranslation(translation.id);
        if (success) {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          setSuccessModal({
            isOpen: true,
            title: 'Berhasil Menghapus Terjemahan',
            message: 'Terjemahan berhasil dihapus dari sistem.',
          });
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedTranslationIds.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: 'Hapus Terjemahan Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedTranslationIds.length} terjemahan terpilih?`,
      type: 'delete',
      onConfirm: async () => {
        const success = await bulkDeleteTranslation(selectedTranslationIds);
        if (success) {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          setSuccessModal({
            isOpen: true,
            title: 'Berhasil Menghapus Terjemahan',
            message: `${selectedTranslationIds.length} terjemahan berhasil dihapus dari sistem.`,
          });
          setSelectedTranslationIds([]);
        }
      },
    });
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedTranslationIds(ids);
  };

  const handleFormSubmit = async (
    data: TranslationCreateRequest | TranslationUpdateRequest
  ) => {
    if (formMode === 'create') {
      const success = await createTranslation(data as TranslationCreateRequest);
      if (success) {
        setIsModalOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Membuat Terjemahan',
          message: 'Terjemahan baru berhasil ditambahkan ke dalam sistem.',
        });
      }
      return success;
    } else {
      const success = await updateTranslation(data as TranslationUpdateRequest);
      if (success) {
        setIsModalOpen(false);
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Update Terjemahan',
          message: 'Data terjemahan berhasil diperbarui.',
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
          Translations Library
        </h1>
        <p className="text-text-secondary text-[clamp(0.875rem,1vw,1rem)]">
          Manage, edit, and organize the complete collection of verse
          translations.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="flex flex-col gap-[clamp(1.5rem,2vw,2rem)]">
        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)]">
          <TranslationToolbar
            onSearch={handleSearch}
            onFilterClick={handleFilter}
            onNewTranslationClick={handleNewTranslation}
            onBulkDeleteClick={handleBulkDelete}
          />

          {/* Loading State */}
          {isTranslationLoading && !translationList && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error State */}
          {translationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {translationError}
            </div>
          )}

          {/* Translation List */}
          {(!isTranslationLoading || translationList) && !translationError && (
            <TranslationList
              translations={translationList?.data || []}
              onEdit={handleEditTranslation}
              onDelete={handleDelete}
              selectedIds={selectedTranslationIds}
              onSelectionChange={handleSelectionChange}
            />
          )}

          {/* Pagination */}
          {translationList && translationList.meta && (
            <Pagination
              currentPage={translationList.meta.page}
              totalPages={translationList.meta.totalPages}
              totalEntries={translationList.meta.total}
              pageSize={translationList.meta.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <TranslationForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          isLoading={isTranslationLoading}
          mode={formMode}
          initialData={selectedTranslation}
          verses={dropdownOptions.verses}
          error={translationError}
        />
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <TranslationFilter
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilter}
          dropdownOptions={dropdownOptions}
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
        isLoading={isTranslationLoading}
        variant="danger"
      />
    </div>
  );
}
