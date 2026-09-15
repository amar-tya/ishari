import React, { useState } from 'react';
import { CreateHadiDTO, UpdateHadiDTO } from '@/application/dto';
import { Modal, Input, TextArea, Button } from '../base';
import { HadiEntity } from '@/core/entities';

export type HadiFormMode = 'create' | 'edit';

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface HadiFormData {
  name: string;
  description: string;
  photo: File | null;
}

interface HadiFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHadiDTO | UpdateHadiDTO) => Promise<boolean>;
  isLoading?: boolean;
  mode?: HadiFormMode;
  initialData?: HadiEntity;
  error?: string | null;
}

function entityToFormData(entity: HadiEntity): HadiFormData {
  return {
    name: entity.name || '',
    description: entity.description || '',
    photo: null,
  };
}

const INITIAL_STATE: HadiFormData = {
  name: '',
  description: '',
  photo: null,
};

const HadiFormInternal: React.FC<{
  onClose: () => void;
  onSubmit: (data: CreateHadiDTO | UpdateHadiDTO) => Promise<boolean>;
  isLoading: boolean;
  mode: HadiFormMode;
  initialData?: HadiEntity;
  error?: string | null;
}> = ({ onClose, onSubmit, isLoading, mode, initialData, error }) => {
  const initialFormData =
    mode === 'edit' && initialData
      ? entityToFormData(initialData)
      : INITIAL_STATE;

  const [formData, setFormData] = useState<HadiFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    mode === 'edit' && initialData ? initialData.imageUrl : null
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData: CreateHadiDTO | UpdateHadiDTO = {
      name: formData.name,
      description: formData.description.trim() || undefined,
      photo: formData.photo || undefined,
    };

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        photo: `File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimum 5 MB.`,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, photo: file }));
    setPhotoPreview(URL.createObjectURL(file));
    if (errors.photo) setErrors((prev) => ({ ...prev, photo: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <Input
        label="Name"
        name="name"
        placeholder="Nama Hadi..."
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        disabled={isLoading}
      />

      <TextArea
        label="Description"
        name="description"
        placeholder="Deskripsi..."
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        disabled={isLoading}
        rows={3}
      />

      <div className="flex flex-col gap-2">
        <label className="text-body font-semibold text-text-primary">
          Photo
        </label>
        {photoPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoPreview}
            alt="Preview foto hadi"
            className="w-24 h-24 rounded-xl object-cover border border-border-light"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          disabled={isLoading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary/10 file:text-primary
            hover:file:bg-primary/20 cursor-pointer"
        />
        {errors.photo && (
          <p className="text-sm text-error mt-1">{errors.photo}</p>
        )}
        {mode === 'edit' && !formData.photo && (
          <p className="text-sm text-text-secondary">
            Biarkan kosong jika tidak ingin mengubah foto.
          </p>
        )}
      </div>

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

export const HadiForm: React.FC<HadiFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = 'create',
  initialData,
  error,
}) => {
  const modalTitle = mode === 'edit' ? 'Edit Hadi' : 'Create Hadi';
  const formKey = `${mode}-${initialData?.id ?? 'new'}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <HadiFormInternal
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
