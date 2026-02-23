import React, { useState } from 'react';
import { UserCreateRequest, UserUpdateRequest } from '@/application/dto';
import { Modal, Input, Button, Select } from '../base';
import { UserEntity } from '@/core/entities';

export type UserFormMode = 'create' | 'edit';

export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  isActive: string;
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserCreateRequest | UserUpdateRequest) => Promise<boolean>;
  isLoading?: boolean;
  mode?: UserFormMode;
  initialData?: UserEntity;
  error?: string | null;
}

function entityToFormData(entity: UserEntity): UserFormData {
  return {
    username: entity.username || '',
    email: entity.email || '',
    password: '',
    isActive: entity.isActive ? 'true' : 'false',
  };
}

const INITIAL_STATE: UserFormData = {
  username: '',
  email: '',
  password: '',
  isActive: 'true',
};

const UserFormInternal: React.FC<{
  onClose: () => void;
  onSubmit: (data: UserCreateRequest | UserUpdateRequest) => Promise<boolean>;
  isLoading: boolean;
  mode: UserFormMode;
  initialData?: UserEntity;
  error?: string | null;
}> = ({ onClose, onSubmit, isLoading, mode, initialData, error }) => {
  const initialFormData =
    mode === 'edit' && initialData
      ? entityToFormData(initialData)
      : INITIAL_STATE;

  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (mode === 'create' && !formData.password)
      newErrors.password = 'Password is required to create a new user';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let submitData: UserCreateRequest | UserUpdateRequest;

    if (mode === 'edit' && initialData) {
      submitData = {
        id: initialData.id,
        username: formData.username,
        email: formData.email,
        isActive: formData.isActive === 'true',
      } as UserUpdateRequest;
    } else {
      submitData = {
        username: formData.username,
        email: formData.email,
        password: formData.password!,
      } as UserCreateRequest;
    }

    const success = await onSubmit(submitData);
    if (success) {
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        label="Username"
        name="username"
        type="text"
        placeholder="Enter username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        disabled={isLoading}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="Enter email address"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isLoading}
      />

      {mode === 'create' && (
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isLoading}
        />
      )}

      {mode === 'edit' && (
        <Select
          label="Status"
          name="isActive"
          value={formData.isActive}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
      )}

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

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = 'create',
  initialData,
  error,
}) => {
  const modalTitle = mode === 'edit' ? 'Edit User' : 'Create User';
  const formKey = `${mode}-${initialData?.id ?? 'new'}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <UserFormInternal
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
