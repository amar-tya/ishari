import React, { useState } from 'react';
import { CreateHadiDTO, UpdateHadiDTO } from '@/application/dto';
import { Modal, Input, TextArea, Button } from '../base';
import { HadiEntity } from '@/core/entities';

export type HadiFormMode = 'create' | 'edit';

export interface HadiFormData {
  name: string;
  description: string;
  image_url: string;
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
    image_url: entity.imageUrl || '',
  };
}

const INITIAL_STATE: HadiFormData = {
  name: '',
  description: '',
  image_url: '',
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let submitData: CreateHadiDTO | UpdateHadiDTO;

    if (mode === 'edit' && initialData) {
      submitData = {
        name: formData.name,
        description: formData.description.trim() || undefined,
        image_url: formData.image_url.trim() || undefined,
      } as UpdateHadiDTO;
    } else {
      submitData = {
        name: formData.name,
        description: formData.description.trim() || undefined,
        image_url: formData.image_url.trim() || undefined,
      } as CreateHadiDTO;
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

      <Input
        label="Photo URL"
        name="image_url"
        placeholder="https://example.com/photo.jpg"
        value={formData.image_url}
        onChange={handleChange}
        error={errors.image_url}
        disabled={isLoading}
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
