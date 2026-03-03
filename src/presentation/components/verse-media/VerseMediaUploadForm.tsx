import React, { useState, useEffect } from 'react';
import { CreateVerseMediaDTO, UpdateVerseMediaDTO } from '@/application/dto';
import { Modal, TextArea, Button, SearchableSelect } from '../base';
import { VerseMediaEntity, HadiEntityList, BookEntity } from '@/core/entities';
import {
  useBookViewModel,
  useChapterViewModel,
  useVerseViewModel,
} from '@/presentation/view-models';

export type VerseMediaFormMode = 'create' | 'edit';

interface VerseMediaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateVerseMediaDTO | UpdateVerseMediaDTO
  ) => Promise<boolean>;
  isLoading?: boolean;
  mode?: VerseMediaFormMode;
  initialData?: VerseMediaEntity;
  hadiList: HadiEntityList | null;
  error?: string | null;
}

interface FormData {
  bookId: string;
  chapterId: string;
  verseId: string;
  hadiId: string;
  description: string;
  type: string;
  file: File | null;
}

const VerseMediaFormInternal: React.FC<{
  onClose: () => void;
  onSubmit: (
    data: CreateVerseMediaDTO | UpdateVerseMediaDTO
  ) => Promise<boolean>;
  isLoading: boolean;
  mode: VerseMediaFormMode;
  initialData?: VerseMediaEntity;
  hadiList: HadiEntityList | null;
  error?: string | null;
}> = ({ onClose, onSubmit, isLoading, mode, initialData, hadiList, error }) => {
  const { bookList, getBookList } = useBookViewModel();
  const {
    chapterList,
    findChapter,
    isLoading: isChapterLoading,
  } = useChapterViewModel();
  const {
    verseList,
    findVerse,
    isLoading: isVerseLoading,
  } = useVerseViewModel();

  const [formData, setFormData] = useState<FormData>({
    bookId: '',
    chapterId: '',
    verseId: mode === 'edit' && initialData ? String(initialData.verseId) : '',
    hadiId:
      mode === 'edit' && initialData?.hadiId ? String(initialData.hadiId) : '',
    description:
      mode === 'edit' && initialData?.description
        ? initialData.description
        : '',
    type: mode === 'edit' && initialData?.type ? initialData.type : '',
    file: null,
  });

  useEffect(() => {
    if (mode === 'create') {
      getBookList();
    }
  }, [mode, getBookList]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bookId = e.target.value;
    setFormData((prev) => ({ ...prev, bookId, chapterId: '', verseId: '' }));
    if (bookId) {
      findChapter({ bookId: Number(bookId), limit: 1000 });
    }
  };

  const handleChapterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const chapterId = e.target.value;
    setFormData((prev) => ({ ...prev, chapterId, verseId: '' }));
    if (chapterId) {
      findChapter({ bookId: Number(formData.bookId), limit: 1000 }); // Fix: added bookId if needed, though chapterId fetch might be sufficient
      findVerse({ chapterId: Number(chapterId), limit: 1000 });
    }
  };

  const handleVerseChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const verseId = e.target.value;
    setFormData((prev) => ({ ...prev, verseId }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'create') {
      if (!formData.verseId) newErrors.verseId = 'Verse ID is required';
      else if (isNaN(Number(formData.verseId)))
        newErrors.verseId = 'Verse ID must be a number';

      if (!formData.file)
        newErrors.file = 'File audio is required for new media';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let submitData: CreateVerseMediaDTO | UpdateVerseMediaDTO;

    const hadiName =
      formData.hadiId && hadiList
        ? hadiList.data.find((h) => String(h.id) === formData.hadiId)?.name ||
          'unknown-hadi'
        : 'unknown-hadi';

    if (mode === 'edit' && initialData) {
      submitData = {
        description: formData.description.trim() || undefined,
        type:
          (formData.type as 'Joz' | 'Yahum' | 'Terem' | 'Inat' | 'Rojazz') ||
          undefined,
      } as UpdateVerseMediaDTO;

      if (formData.file) {
        submitData.file = formData.file;
        const fileName = formData.file.name
          .replace(/[^a-zA-Z0-9.\-_]/g, '-')
          .toLowerCase();
        const hadiSlug = hadiName.replace(/\s+/g, '-').toLowerCase();
        submitData.storagePath = `${hadiSlug}/${Date.now()}-${fileName}`;
      }
    } else {
      const parsedVerseId = Number(formData.verseId);
      const parsedHadiId = formData.hadiId
        ? Number(formData.hadiId)
        : undefined;
      const file = formData.file as File;

      const fileName = file.name
        .replace(/[^a-zA-Z0-9.\-_]/g, '-')
        .toLowerCase();
      const hadiSlug = hadiName.replace(/\s+/g, '-').toLowerCase();
      const storagePath = `${hadiSlug}/${Date.now()}-${fileName}`;

      submitData = {
        verseId: parsedVerseId,
        hadiId: parsedHadiId,
        mediaType: 'audio',
        file: file,
        type:
          (formData.type as 'Joz' | 'Yahum' | 'Terem' | 'Inat' | 'Rojazz') ||
          undefined,
        description: formData.description.trim() || undefined,
        storagePath,
      } as CreateVerseMediaDTO;
    }

    const success = await onSubmit(submitData);
    if (success) {
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
      if (errors.file) setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-body font-semibold text-text-primary">
          Media Type (Optional)
        </label>
        <select
          name="type"
          className="w-full px-4 py-3 border border-border-light rounded-xl text-body bg-bg-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={formData.type}
          onChange={handleInputChange}
          disabled={isLoading}
        >
          <option value="">Pilih Tipe...</option>
          <option value="Joz">Joz</option>
          <option value="Yahum">Yahum</option>
          <option value="Terem">Terem</option>
          <option value="Inat">Inat</option>
          <option value="Rojazz">Rojazz</option>
        </select>
      </div>

      {mode === 'create' && (
        <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm font-semibold text-primary">Pilih Ayat</p>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Kitab
            </label>
            <select
              name="bookId"
              className="w-full px-4 py-2.5 border border-border-light rounded-lg text-sm bg-white focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              value={formData.bookId}
              onChange={handleBookChange}
              disabled={isLoading}
            >
              <option value="">Pilih Kitab...</option>
              {bookList?.data.map((b: BookEntity) => (
                <option key={b.id} value={String(b.id)}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          <SearchableSelect
            label="Chapter / Bab"
            placeholder={
              formData.bookId ? 'Pilih Bab...' : 'Pilih Kitab dulu...'
            }
            value={formData.chapterId}
            onChange={handleChapterChange}
            options={
              chapterList?.data.map((c) => ({
                value: c.id,
                label: `${c.chapterNumber}. ${c.title}`,
              })) || []
            }
            disabled={!formData.bookId || isLoading || isChapterLoading}
            error={errors.chapterId}
          />

          <SearchableSelect
            label="Ayat"
            placeholder={
              formData.chapterId ? 'Pilih Ayat...' : 'Pilih Bab dulu...'
            }
            value={formData.verseId}
            onChange={handleVerseChange}
            options={
              verseList?.data.map((v) => ({
                value: v.id,
                label: `Ayat ${v.verseNumber} - ${v.id}: ${v.arabicText.substring(0, 30)}...`,
              })) || []
            }
            disabled={!formData.chapterId || isLoading || isVerseLoading}
            error={errors.verseId}
          />
        </div>
      )}

      {mode === 'create' && (
        <div className="flex flex-col gap-2">
          <label className="text-body font-semibold text-text-primary">
            Hadi (Optional)
          </label>
          <select
            name="hadiId"
            className="w-full px-4 py-3 border border-border-light rounded-xl text-body bg-bg-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={formData.hadiId}
            onChange={handleInputChange}
            disabled={isLoading}
          >
            <option value="">Pilih Hadi...</option>
            {hadiList?.data.map((h) => (
              <option key={h.id} value={String(h.id)}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <TextArea
        label="Description"
        name="description"
        placeholder="Deskripsi media ini (optional)"
        value={formData.description}
        onChange={handleInputChange}
        error={errors.description}
        disabled={isLoading}
        rows={3}
      />

      <div className="flex flex-col gap-2">
        <label className="text-body font-semibold text-text-primary">
          File Audio {mode === 'create' && '*'}
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={isLoading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary/10 file:text-primary
            hover:file:bg-primary/20 cursor-pointer"
        />
        {errors.file && (
          <p className="text-sm text-error mt-1">{errors.file}</p>
        )}
        {mode === 'edit' && !formData.file && (
          <p className="text-sm text-text-secondary">
            Biarkan kosong jika tidak ingin mengubah audio.
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
          {mode === 'edit' ? 'Update Audio' : 'Upload Audio'}
        </Button>
      </div>
    </form>
  );
};

export const VerseMediaUploadForm: React.FC<VerseMediaFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = 'create',
  initialData,
  hadiList,
  error,
}) => {
  const modalTitle = mode === 'edit' ? 'Edit Audio' : 'Upload Audio Baru';
  const formKey = `${mode}-${initialData?.id ?? 'new'}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <VerseMediaFormInternal
        key={formKey}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode={mode}
        initialData={initialData}
        hadiList={hadiList}
        error={error}
      />
    </Modal>
  );
};
