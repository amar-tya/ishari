import React, { useState } from 'react';
import {
  TranslationCreateRequest,
  TranslationUpdateRequest,
} from '@/application/dto';
import { Modal, Input, Button, Select, TextArea } from '../base';
import { TranslationEntity, VerseDropdown } from '@/core/entities';

export type TranslationFormMode = 'create' | 'edit';

export interface TranslationFormData {
  verseId: string;
  languageCode: string;
  translator: string;
  translation: string;
}

interface TranslationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: TranslationCreateRequest | TranslationUpdateRequest
  ) => Promise<boolean>;
  isLoading?: boolean;
  mode?: TranslationFormMode;
  initialData?: TranslationEntity;
  verses: VerseDropdown[];
  error?: string | null;
}

function entityToFormData(entity: TranslationEntity): TranslationFormData {
  return {
    verseId: entity.verseId ? entity.verseId.toString() : '',
    languageCode: entity.languageCode || '',
    translator: entity.translator || '',
    translation: entity.translation || '',
  };
}

const INITIAL_STATE: TranslationFormData = {
  verseId: '',
  languageCode: 'en', // Default to English
  translator: '',
  translation: '',
};

const TranslationFormInternal: React.FC<{
  onClose: () => void;
  onSubmit: (
    data: TranslationCreateRequest | TranslationUpdateRequest
  ) => Promise<boolean>;
  isLoading: boolean;
  mode: TranslationFormMode;
  initialData?: TranslationEntity;
  verses: VerseDropdown[];
  error?: string | null;
}> = ({ onClose, onSubmit, isLoading, mode, initialData, verses, error }) => {
  const initialFormData =
    mode === 'edit' && initialData
      ? entityToFormData(initialData)
      : INITIAL_STATE;

  const [formData, setFormData] =
    useState<TranslationFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.verseId) newErrors.verseId = 'Verse is required';
    if (!formData.languageCode)
      newErrors.languageCode = 'Language Code is required';
    if (!formData.translator.trim())
      newErrors.translator = 'Translator name is required';
    if (!formData.translation.trim())
      newErrors.translation = 'Translation text is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let submitData: TranslationCreateRequest | TranslationUpdateRequest;

    if (mode === 'edit' && initialData) {
      submitData = {
        translationId: initialData.id,
        verseId: Number(formData.verseId),
        languageCode: formData.languageCode,
        translator: formData.translator.trim(),
        translation: formData.translation.trim(),
      } as TranslationUpdateRequest;
    } else {
      submitData = {
        verseId: Number(formData.verseId),
        languageCode: formData.languageCode,
        translator: formData.translator.trim(),
        translation: formData.translation.trim(),
      } as TranslationCreateRequest;
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
      <Select
        label="Verse"
        name="verseId"
        value={formData.verseId}
        onChange={handleChange}
        error={errors.verseId}
        disabled={isLoading}
      >
        <option value="">Pilih Ayat</option>
        {verses.map((verse) => (
          <option key={verse.id} value={verse.id}>
            ({verse.id}) {verse.arabicText?.substring(0, 30) || ''}...
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Language Code"
          name="languageCode"
          placeholder="e.g., en, id, ar"
          value={formData.languageCode}
          onChange={handleChange}
          error={errors.languageCode}
          disabled={isLoading}
        />

        <Input
          label="Translator"
          name="translator"
          placeholder="Nama Penerjemah"
          value={formData.translator}
          onChange={handleChange}
          error={errors.translator}
          disabled={isLoading}
        />
      </div>

      <TextArea
        label="Translation"
        name="translation"
        placeholder="Masukkan teks terjemahan..."
        value={formData.translation}
        onChange={handleChange}
        error={errors.translation}
        disabled={isLoading}
        rows={6}
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

export const TranslationForm: React.FC<TranslationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = 'create',
  initialData,
  verses,
  error,
}) => {
  const modalTitle =
    mode === 'edit' ? 'Edit Translation' : 'Create Translation';
  const formKey = `${mode}-${initialData?.id ?? 'new'}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <TranslationFormInternal
        key={formKey}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode={mode}
        initialData={initialData}
        verses={verses}
        error={error}
      />
    </Modal>
  );
};
