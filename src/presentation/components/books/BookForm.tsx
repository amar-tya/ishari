import React, { useState } from 'react';
import { CreateBookDTO, UpdateBookDTO } from '@/application';
import { Modal, Input, TextArea, Button } from '../base';
import { BookEntity } from '@/core/entities';

export type BookFormMode = 'create' | 'edit';

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  published_year: string;
  cover_image_url: string;
}

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookDTO | UpdateBookDTO) => Promise<boolean>;
  isLoading?: boolean;
  mode?: BookFormMode;
  initialData?: BookEntity;
  error?: string | null;
}

/**
 * Convert BookEntity to form state
 */
function entityToFormData(entity: BookEntity): BookFormData {
  return {
    title: entity.title,
    author: entity.author ?? '',
    description: entity.description ?? '',
    published_year: entity.publishedYear
      ? new Date(entity.publishedYear).getFullYear().toString()
      : '',
    cover_image_url: entity.coverImageUrl ?? '',
  };
}

const INITIAL_STATE: BookFormData = {
  title: '',
  author: '',
  description: '',
  published_year: '',
  cover_image_url: '',
};

/**
 * Internal form component that gets re-mounted when key changes
 */
const BookFormInternal: React.FC<{
  onClose: () => void;
  onSubmit: (data: CreateBookDTO | UpdateBookDTO) => Promise<boolean>;
  isLoading: boolean;
  mode: BookFormMode;
  initialData?: BookEntity;
  error?: string | null;
}> = ({ onClose, onSubmit, isLoading, mode, initialData, error }) => {
  // Initialize form data based on mode
  const initialFormData =
    mode === 'edit' && initialData
      ? entityToFormData(initialData)
      : INITIAL_STATE;

  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert local state to DTO - empty strings become undefined
    const submitData: CreateBookDTO | UpdateBookDTO = {
      title: formData.title,
      author: formData.author.trim() || undefined,
      description: formData.description.trim() || undefined,
      published_year: formData.published_year.trim()
        ? new Date(Number.parseInt(formData.published_year), 0, 1)
        : undefined,
      cover_image_url: formData.cover_image_url.trim() || undefined,
    };

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

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getSubmitButtonText = (): string => {
    if (isLoading) return 'Saving...';
    if (mode === 'edit') return 'Update';
    return 'Simpan';
  };

  const submitButtonText = getSubmitButtonText();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-4">
        <Input
          label="Title"
          name="title"
          placeholder="Enter book title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          disabled={isLoading}
        />

        <Input
          label="Author"
          name="author"
          placeholder="Enter author name"
          value={formData.author}
          onChange={handleChange}
          error={errors.author}
          disabled={isLoading}
        />

        <TextArea
          label="Description"
          name="description"
          placeholder="Enter book description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          disabled={isLoading}
        />

        <Input
          label="Published Year"
          name="published_year"
          placeholder="e.g. 2023"
          type="number"
          value={formData.published_year}
          onChange={handleChange}
          error={errors.published_year}
          disabled={isLoading}
        />

        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <Input
              label="Cover Image URL"
              name="cover_image_url"
              placeholder="https://example.com/cover.jpg"
              value={formData.cover_image_url}
              onChange={handleChange}
              error={errors.cover_image_url}
              helperText="Enter a valid URL for the book cover image."
              disabled={isLoading}
            />
          </div>
          {/* Thumbnail Preview */}
          <div className="mt-7 w-12 h-12 rounded bg-(--color-bg-base) border border-border flex items-center justify-center overflow-hidden shrink-0 text-text-muted">
            {formData.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={formData.cover_image_url}
                alt="Cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ''; // Clear on error
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
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
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

/**
 * BookForm wrapper - controls Modal and passes key to force re-mount of internal form
 */
export const BookForm: React.FC<BookFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = 'create',
  initialData,
  error,
}) => {
  const modalTitle = mode === 'edit' ? 'Edit Buku' : 'Tambah Buku';

  // Generate a unique key based on mode and book ID to force re-mount
  const formKey = `${mode}-${initialData?.id ?? 'new'}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <BookFormInternal
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
