import React, { useState } from 'react';
import {
  BookmarkCreateRequest,
  BookmarkUpdateRequest,
} from '@/application/dto';
import { BookmarkEntity } from '@/core/entities';
import { Modal, Input, TextArea, Button } from '../base';

export type BookmarkFormMode = 'create' | 'edit';

export interface BookmarkFormData {
  verseId: string;
  note: string;
}

interface BookmarkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: BookmarkCreateRequest | BookmarkUpdateRequest
  ) => Promise<boolean>;
  isLoading?: boolean;
  mode?: BookmarkFormMode;
  initialData?: BookmarkEntity;
  error?: string | null;
}

const INITIAL_STATE: BookmarkFormData = {
  verseId: '',
  note: '',
};

const BookmarkFormInternal: React.FC<{
  onClose: () => void;
  onSubmit: (
    data: BookmarkCreateRequest | BookmarkUpdateRequest
  ) => Promise<boolean>;
  isLoading: boolean;
  mode: BookmarkFormMode;
  initialData?: BookmarkEntity;
  error?: string | null;
}> = ({ onClose, onSubmit, isLoading, mode, initialData, error }) => {
  const initialFormData =
    mode === 'edit' && initialData
      ? {
          verseId: initialData.verseId.toString(),
          note: initialData.note || '',
        }
      : INITIAL_STATE;

  const [formData, setFormData] = useState<BookmarkFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.verseId) newErrors.verseId = 'Verse ID is required';
    if (!formData.note.trim()) newErrors.note = 'Note is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let submitData: BookmarkCreateRequest | BookmarkUpdateRequest;

    if (mode === 'edit' && initialData) {
      submitData = {
        bookmarkId: initialData.id,
        note: formData.note,
      } as BookmarkUpdateRequest;
    } else {
      submitData = {
        verseId: Number(formData.verseId),
        note: formData.note,
      } as BookmarkCreateRequest;
    }

    const success = await onSubmit(submitData);
    if (success) {
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

      {mode === 'create' && (
        <Input
          label="Verse ID"
          name="verseId"
          type="number"
          placeholder="Enter Verse ID"
          value={formData.verseId}
          onChange={handleChange}
          error={errors.verseId}
          disabled={isLoading}
        />
      )}

      <TextArea
        label="Note"
        name="note"
        placeholder="Enter your private note..."
        value={formData.note}
        onChange={handleChange}
        error={errors.note}
        disabled={isLoading}
        rows={4}
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          variant="secondary"
          type="button"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {mode === 'edit' ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export const BookmarkForm: React.FC<BookmarkFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = 'create',
  initialData,
  error,
}) => {
  const modalTitle = mode === 'edit' ? 'Edit Bookmark' : 'Create Bookmark';
  const formKey = `${mode}-${initialData?.id ?? 'new'}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <BookmarkFormInternal
        key={formKey}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode={mode}
        initialData={initialData}
        error={error}
      />
    </Modal>
  );
};
