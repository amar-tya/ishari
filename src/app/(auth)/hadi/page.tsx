'use client';

import React, { useEffect, useState } from 'react';
import {
  HadiList,
  HadiToolbar,
  HadiForm,
} from '@/presentation/components/hadi';
import { useHadiViewModel } from '@/presentation/view-models';
import { HadiEntity } from '@/core/entities';
import { CreateHadiDTO, UpdateHadiDTO } from '@/application/dto';

export default function HadiPage() {
  const {
    isLoading,
    error,
    hadiList,
    getHadiList,
    storeHadi,
    updateHadi,
    removeHadi,
  } = useHadiViewModel();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedHadi, setSelectedHadi] = useState<HadiEntity | undefined>(
    undefined
  );

  useEffect(() => {
    getHadiList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (query: string) => {
    getHadiList(1, query);
  };

  const handleNewHadi = () => {
    setFormMode('create');
    setSelectedHadi(undefined);
    setIsFormOpen(true);
  };

  const handleEditHadi = (id: number) => {
    const hadi = hadiList?.data.find((h) => h.id === id);
    if (hadi) {
      setFormMode('edit');
      setSelectedHadi(hadi);
      setIsFormOpen(true);
    }
  };

  const handleDeleteHadi = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus Hadi ini?')) {
      await removeHadi(id);
    }
  };

  const handleFormSubmit = async (data: CreateHadiDTO | UpdateHadiDTO) => {
    if (formMode === 'create') {
      return await storeHadi(data as CreateHadiDTO);
    } else if (selectedHadi) {
      return await updateHadi(selectedHadi.id, data as UpdateHadiDTO);
    }
    return false;
  };

  return (
    <div className="p-[clamp(1rem,2vw,2rem)] flex flex-col gap-[clamp(1rem,2vw,1.5rem)] max-w-[1600px] mx-auto w-full animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[clamp(1.5rem,2.5vw,2rem)] font-bold text-primary">
          Hadi Library
        </h1>
        <p className="text-text-secondary text-[clamp(0.875rem,1vw,1rem)]">
          Manage, edit, and organize the complete collection of hadi.
        </p>
      </div>

      {/* Toolbar Section */}
      <HadiToolbar onSearch={handleSearch} onNewHadiClick={handleNewHadi} />

      {/* Main Content Card/Table */}
      <div className="flex-1 flex flex-col min-h-0">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => getHadiList()}
              className="underline font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && !hadiList ? (
          <div className="flex-1 flex items-center justify-center p-12 bg-white rounded-xl border border-border shadow-card">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-text-secondary font-medium animate-pulse">
                Loading Hadis...
              </p>
            </div>
          </div>
        ) : (
          <HadiList
            hadis={hadiList?.data || []}
            onEdit={handleEditHadi}
            onDelete={handleDeleteHadi}
          />
        )}
      </div>

      {/* Hadi Form Modal */}
      <HadiForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        mode={formMode}
        initialData={selectedHadi}
        error={error}
      />
    </div>
  );
}
