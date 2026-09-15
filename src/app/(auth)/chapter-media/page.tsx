'use client';

import React, { useEffect, useState } from 'react';
import {
  ChapterMediaList,
  ChapterMediaToolbar,
  ChapterMediaUploadForm,
} from '@/presentation/components/chapter-media';
import { ConfirmModal, SuccessModal } from '@/presentation/components/base';
import {
  useChapterMediaViewModel,
  useHadiViewModel,
} from '@/presentation/view-models';
import { ChapterMediaEntity } from '@/core/entities';
import { CreateChapterMediaDTO, UpdateChapterMediaDTO } from '@/application/dto';

export default function ChapterMediaPage() {
  const {
    isLoading,
    error,
    chapterMediaList,
    getChapterMediaList,
    storeChapterMedia,
    updateChapterMedia,
    removeChapterMedia,
    setHadiId,
    setChapterId,
    setSearch,
  } = useChapterMediaViewModel();

  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );

  const { hadiList, getHadiList } = useHadiViewModel();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedMedia, setSelectedMedia] = useState<
    ChapterMediaEntity | undefined
  >(undefined);

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mediaIdToDelete, setMediaIdToDelete] = useState<number | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    getChapterMediaList();
    getHadiList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
    getChapterMediaList(1, query);
  };

  const handleHadiChange = (id: number | null) => {
    setHadiId(id);
    getChapterMediaList(1, undefined, undefined, id || undefined);
  };

  const handleChapterChange = (id: number | null) => {
    setSelectedChapterId(id);
    setChapterId(id);
    getChapterMediaList(1, undefined, id || undefined, undefined);
  };

  const handleNewMedia = () => {
    setFormMode('create');
    setSelectedMedia(undefined);
    setIsFormOpen(true);
  };

  const handleEditMedia = (id: number) => {
    const media = chapterMediaList?.data.find((m) => m.id === id);
    if (media) {
      setFormMode('edit');
      setSelectedMedia(media);
      setIsFormOpen(true);
    }
  };

  const handleDeleteMedia = (id: number) => {
    setMediaIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (mediaIdToDelete === null) return;

    const media = chapterMediaList?.data.find((m) => m.id === mediaIdToDelete);
    if (!media) {
      setIsDeleteModalOpen(false);
      setMediaIdToDelete(null);
      return;
    }

    try {
      let storagePath = '';
      if (media.mediaUrl) {
        const storagePathMatch = media.mediaUrl.match(/chapter-media\/(.+)$/);
        storagePath = storagePathMatch
          ? decodeURIComponent(storagePathMatch[1])
          : '';
      }

      const isSuccess = await removeChapterMedia(
        mediaIdToDelete,
        storagePath || ''
      );

      if (isSuccess) {
        setSuccessMessage('Media berhasil dihapus.');
        setIsSuccessModalOpen(true);
      }
    } finally {
      setIsDeleteModalOpen(false);
      setMediaIdToDelete(null);
    }
  };

  const handleFormSubmit = async (
    data: CreateChapterMediaDTO | UpdateChapterMediaDTO
  ) => {
    let result = false;
    if (formMode === 'create') {
      result = await storeChapterMedia(data as CreateChapterMediaDTO);
    } else if (selectedMedia) {
      result = await updateChapterMedia(
        selectedMedia.id,
        data as UpdateChapterMediaDTO
      );
    }

    if (result) {
      setSuccessMessage(
        formMode === 'create'
          ? 'Media berhasil ditambahkan.'
          : 'Media berhasil diperbarui.'
      );
      setIsSuccessModalOpen(true);
    }

    return result;
  };

  return (
    <div className="p-[clamp(1rem,2vw,2rem)] flex flex-col gap-[clamp(1rem,2vw,1.5rem)] max-w-[1600px] mx-auto w-full animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[clamp(1.5rem,2.5vw,2rem)] font-bold text-primary">
          Chapter Media
        </h1>
        <p className="text-text-secondary text-[clamp(0.875rem,1vw,1rem)]">
          Manage, edit, and organize audio files for chapters.
        </p>
      </div>

      {/* Toolbar Section */}
      <ChapterMediaToolbar
        onSearch={handleSearch}
        onHadiChange={handleHadiChange}
        onChapterChange={handleChapterChange}
        onNewMediaClick={handleNewMedia}
        hadiList={hadiList}
        selectedHadiId={null}
        selectedChapterId={selectedChapterId}
      />

      {/* Main Content Card/Table */}
      <div className="flex-1 flex flex-col min-h-0">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => getChapterMediaList()}
              className="underline font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && !chapterMediaList ? (
          <div className="flex-1 flex items-center justify-center p-12 bg-white rounded-xl border border-border shadow-card">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-text-secondary font-medium animate-pulse">
                Loading Media...
              </p>
            </div>
          </div>
        ) : (
          <ChapterMediaList
            mediaList={chapterMediaList?.data || []}
            hadiList={hadiList}
            onEdit={handleEditMedia}
            onDelete={handleDeleteMedia}
          />
        )}
      </div>

      {/* Chapter Media Form Modal */}
      <ChapterMediaUploadForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        mode={formMode}
        initialData={selectedMedia}
        hadiList={hadiList}
        error={error}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMediaIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Media?"
        message="Apakah Anda yakin ingin menghapus media ini? File audio juga akan dihapus dari storage."
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
