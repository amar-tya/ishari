import React, { useState } from 'react';
import { VerseCreateRequest, VerseUpdateRequest } from '@/application/dto';
import { Modal, Input, TextArea, Button, SearchableSelect } from '../base';
import { VerseEntity, ChapterEntity } from '@/core/entities';

export type VerseFormMode = 'create' | 'edit';

export interface VerseFormData {
  chapterId: string;
  verseNumber: string;
  arabicText: string;
  transliteration: string;
}

interface VerseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VerseCreateRequest | VerseUpdateRequest) => Promise<boolean>;
  isLoading?: boolean;
  mode?: VerseFormMode;
  initialData?: VerseEntity;
  chapters: ChapterEntity[];
  error?: string | null;
}

function entityToFormData(entity: VerseEntity): VerseFormData {
  return {
    chapterId: entity.chapterId ? entity.chapterId.toString() : '',
    verseNumber: entity.verseNumber ? entity.verseNumber.toString() : '',
    arabicText: entity.arabicText || '',
    transliteration: entity.transliteration || '',
  };
}

const INITIAL_STATE: VerseFormData = {
  chapterId: '',
  verseNumber: '',
  arabicText: '',
  transliteration: '',
};
const VerseFormInternal: React.FC<{
  onClose: () => void;
  onSubmit: (data: VerseCreateRequest | VerseUpdateRequest) => Promise<boolean>;
  isLoading: boolean;
  mode: VerseFormMode;
  initialData?: VerseEntity;
  chapters: ChapterEntity[];
  error?: string | null;
}> = ({ onClose, onSubmit, isLoading, mode, initialData, chapters, error }) => {
  const initialFormData =
    mode === 'edit' && initialData
      ? entityToFormData(initialData)
      : INITIAL_STATE;

  const [formData, setFormData] = useState<VerseFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.chapterId) newErrors.chapterId = 'Chapter is required';
    if (!formData.verseNumber)
      newErrors.verseNumber = 'Verse Number is required';
    if (!formData.arabicText.trim())
      newErrors.arabicText = 'Arabic Text is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let submitData: VerseCreateRequest | VerseUpdateRequest;

    if (mode === 'edit' && initialData) {
      submitData = {
        verseId: initialData.id,
        chapterId: Number(formData.chapterId),
        verseNumber: Number(formData.verseNumber),
        arabicText: formData.arabicText,
        transliteration: formData.transliteration.trim() || undefined,
      } as VerseUpdateRequest;
    } else {
      submitData = {
        chapterId: Number(formData.chapterId),
        verseNumber: Number(formData.verseNumber),
        arabicText: formData.arabicText,
        transliteration: formData.transliteration.trim() || undefined,
      } as VerseCreateRequest;
    }

    const success = await onSubmit(submitData);
    if (success) {
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <SearchableSelect
        label="Chapter"
        name="chapterId"
        value={formData.chapterId}
        onChange={handleChange}
        options={[
          { value: '', label: 'Pilih Chapter' },
          ...chapters.map((chapter) => ({
            value: chapter.id,
            label: `${chapter.title} (${chapter.category})`,
          })),
        ]}
        error={errors.chapterId}
        disabled={isLoading}
        placeholder="Pilih Chapter"
      />

      <Input
        label="Verse Number"
        name="verseNumber"
        type="number"
        placeholder="Nomor Ayat"
        value={formData.verseNumber}
        onChange={handleChange}
        error={errors.verseNumber}
        disabled={isLoading}
      />

      <TextArea
        label="Arabic Text"
        name="arabicText"
        placeholder="Masukkan teks Arab..."
        value={formData.arabicText}
        onChange={handleChange}
        error={errors.arabicText}
        disabled={isLoading}
        rows={3}
        className="font-arabic text-right text-xl leading-loose"
      />

      <TextArea
        label="Transliteration"
        name="transliteration"
        placeholder="Masukkan transliterasi..."
        value={formData.transliteration}
        onChange={handleChange}
        error={errors.transliteration}
        disabled={isLoading}
        rows={3}
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          variant="secondary"
          type="button"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {mode === 'edit' ? 'Update' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
};

export const VerseForm: React.FC<VerseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = 'create',
  initialData,
  chapters,
  error,
}) => {
  const modalTitle = mode === 'edit' ? 'Edit Verse' : 'Create Verse';
  const formKey = `${mode}-${initialData?.id ?? 'new'}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <VerseFormInternal
        key={formKey}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode={mode}
        initialData={initialData}
        chapters={chapters}
        error={error}
      />
    </Modal>
  );
};
