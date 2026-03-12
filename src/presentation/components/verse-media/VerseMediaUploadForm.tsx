import React, { useState, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { CreateVerseMediaDTO, UpdateVerseMediaDTO, CreateHadiDTO, UpdateHadiDTO } from '@/application/dto';
import { Modal, TextArea, Button, SearchableSelect } from '../base';
import { PlusIcon } from '../base/icons';
import { VerseMediaEntity, HadiEntityList, BookEntity, VerseEntity } from '@/core/entities';
import {
  useBookViewModel,
  useChapterViewModel,
  useVerseViewModel,
  useHadiViewModel,
} from '@/presentation/view-models';
import { HadiForm } from '../hadi';

// Cache the blob URLs so we only fetch them once
let cachedCoreURL: string | null = null;
let cachedWasmURL: string | null = null;

const getBlobURLs = async () => {
  if (cachedCoreURL && cachedWasmURL) {
    return { coreURL: cachedCoreURL, wasmURL: cachedWasmURL };
  }
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
  cachedCoreURL = await toBlobURL(
    `${baseURL}/ffmpeg-core.js`,
    'text/javascript'
  );
  cachedWasmURL = await toBlobURL(
    `${baseURL}/ffmpeg-core.wasm`,
    'application/wasm'
  );
  return { coreURL: cachedCoreURL, wasmURL: cachedWasmURL };
};

const MAX_AUDIO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

// These formats are already compressed — no need to run FFmpeg on them.
const ALREADY_COMPRESSED_EXTS = new Set([
  '.mp3', '.opus', '.ogg', '.m4a', '.aac', '.webm',
]);

const compressAudio = async (
  file: File,
  updateProgress?: (p: number) => void
): Promise<File> => {
  const ext = (file.name.match(/\.[0-9a-z]+$/i)?.[0] ?? '').toLowerCase();

  // Skip FFmpeg entirely for already-compressed formats — avoids WASM crashes.
  if (ALREADY_COMPRESSED_EXTS.has(ext)) {
    return file;
  }

  if (file.size > MAX_AUDIO_SIZE_BYTES) {
    throw new Error(
      `File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimum 100 MB.`
    );
  }

  // Create a fresh FFmpeg instance each time to avoid WASM memory accumulation
  const ffmpegInstance = new FFmpeg();
  const { coreURL, wasmURL } = await getBlobURLs();

  await ffmpegInstance.load({ coreURL, wasmURL });

  if (updateProgress) {
    ffmpegInstance.on('progress', ({ progress }) => {
      updateProgress(progress);
    });
  }

  const extensionMatch = file.name.match(/\.[0-9a-z]+$/i);
  const extension = extensionMatch ? extensionMatch[0] : '.tmp';
  const inputName = 'input' + extension;
  const outputName = 'output.opus';

  try {
    await ffmpegInstance.writeFile(inputName, await fetchFile(file));

    await ffmpegInstance.exec([
      '-i',
      inputName,
      '-c:a',
      'libopus',
      '-b:a',
      '64k',
      '-vbr',
      'on',
      outputName,
    ]);

    const fileData = await ffmpegInstance.readFile(outputName);
    const data = fileData as Uint8Array;
    // Use `data` (not `data.buffer`) so only the file slice is used,
    // not the entire WASM heap ArrayBuffer.
    const blob = new Blob([data], { type: 'audio/opus' });

    const origNameWithoutExt = file.name.substring(
      0,
      file.name.lastIndexOf('.')
    );
    return new File([blob], `${origNameWithoutExt}.opus`, {
      type: 'audio/opus',
    });
  } finally {
    // Always terminate the instance to free WASM memory
    ffmpegInstance.terminate();
  }
};

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
  preSelectedVerse?: VerseEntity;
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
  error?: string | null;
  preSelectedVerse?: VerseEntity;
}> = ({ onClose, onSubmit, isLoading, mode, initialData, error, preSelectedVerse }) => {
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
  const {
    hadiList: internalHadiList,
    getHadiList,
    storeHadi,
    isLoading: isHadiLoading,
    error: hadiError,
  } = useHadiViewModel();

  const [formData, setFormData] = useState<FormData>({
    bookId: '',
    chapterId: '',
    verseId: mode === 'edit' && initialData
      ? String(initialData.verseId)
      : preSelectedVerse
        ? String(preSelectedVerse.id)
        : '',
    hadiId:
      mode === 'edit' && initialData?.hadiId ? String(initialData.hadiId) : '',
    description:
      mode === 'edit' && initialData?.description
        ? initialData.description
        : '',
    type: mode === 'edit' && initialData?.type ? initialData.type : '',
    file: null,
  });

  const [isCreateHadiOpen, setIsCreateHadiOpen] = useState(false);

  useEffect(() => {
    getHadiList();
  }, [getHadiList]);

  useEffect(() => {
    if (mode === 'create' && !preSelectedVerse) {
      getBookList();
    }
  }, [mode, preSelectedVerse, getBookList]);

  const handleCreateHadi = async (dto: CreateHadiDTO | UpdateHadiDTO) => {
    const result = await storeHadi(dto as CreateHadiDTO);
    if (result) {
      setIsCreateHadiOpen(false);
    }
    return result;
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);

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
      formData.hadiId && internalHadiList
        ? internalHadiList.data.find((h) => String(h.id) === formData.hadiId)?.name ||
          'unknown-hadi'
        : 'unknown-hadi';

    const chapterData =
      preSelectedVerse?.chapter
        ? preSelectedVerse.chapter
        : formData.chapterId && chapterList
          ? chapterList.data.find((c) => String(c.id) === formData.chapterId)
          : null;

    const chapterTitle = chapterData?.title || 'unknown-chapter';
    const chapterCategory = chapterData?.category || 'unknown-category';

    if (mode === 'edit' && initialData) {
      submitData = {
        description: formData.description.trim() || undefined,
        type:
          (formData.type as 'Joz' | 'Yahum' | 'Terem' | 'Inat' | 'Rojazz') ||
          undefined,
      } as UpdateVerseMediaDTO;

      if (formData.file) {
        setIsCompressing(true);
        setCompressionProgress(0);
        try {
          const processedFile = await compressAudio(
            formData.file,
            setCompressionProgress
          );
          submitData.file = processedFile;
          const fileName = processedFile.name
            .replace(/[^a-zA-Z0-9.\-_]/g, '-')
            .toLowerCase();
          const hadiSlug = hadiName.replace(/\s+/g, '-').toLowerCase();
          const chapterSlug = chapterTitle.replace(/\s+/g, '-').toLowerCase();
          const categorySlug = chapterCategory
            .replace(/\s+/g, '-')
            .toLowerCase();

          submitData.storagePath = `${hadiSlug}/${chapterSlug}/${categorySlug}/${Date.now()}-${fileName}`;
        } catch (error) {
          console.error('Audio compression failed:', error);
          setErrors((prev) => ({
            ...prev,
            file:
              error instanceof Error
                ? error.message
                : 'Gagal mengkompresi audio. Coba lagi.',
          }));
          setIsCompressing(false);
          return;
        }
        setIsCompressing(false);
      }
    } else {
      const parsedVerseId = Number(formData.verseId);
      const parsedHadiId = formData.hadiId
        ? Number(formData.hadiId)
        : undefined;

      setIsCompressing(true);
      setCompressionProgress(0);
      try {
        const file = await compressAudio(
          formData.file as File,
          setCompressionProgress
        );

        const fileName = file.name
          .replace(/[^a-zA-Z0-9.\-_]/g, '-')
          .toLowerCase();
        const hadiSlug = hadiName.replace(/\s+/g, '-').toLowerCase();
        const chapterSlug = chapterTitle.replace(/\s+/g, '-').toLowerCase();
        const categorySlug = chapterCategory.replace(/\s+/g, '-').toLowerCase();
        const storagePath = `${hadiSlug}/${chapterSlug}/${categorySlug}/${Date.now()}-${fileName}`;

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
      } catch (error) {
        console.error('Audio compression failed:', error);
        setErrors((prev) => ({
          ...prev,
          file: 'Gagal mengkompresi audio. Coba lagi.',
        }));
        setIsCompressing(false);
        return;
      }
      setIsCompressing(false);
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
    <>
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
          disabled={isLoading || isCompressing}
        >
          <option value="">Pilih Tipe...</option>
          <option value="Joz">Joz</option>
          <option value="Yahum">Yahum</option>
          <option value="Terem">Terem</option>
          <option value="Inat">Inat</option>
          <option value="Rojazz">Rojazz</option>
        </select>
      </div>

      {mode === 'create' && preSelectedVerse && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Ayat</span>
            <span className="text-sm font-medium text-text-primary">
              {preSelectedVerse.chapter?.title} · Ayat {preSelectedVerse.verseNumber}
            </span>
          </div>
        </div>
      )}

      {mode === 'create' && !preSelectedVerse && (
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
              disabled={isLoading || isCompressing}
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
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <SearchableSelect
                name="hadiId"
                placeholder="Pilih Hadi..."
                value={formData.hadiId}
                onChange={handleInputChange}
                options={
                  internalHadiList?.data.map((h) => ({
                    value: h.id,
                    label: h.name,
                  })) || []
                }
                disabled={isLoading || isCompressing || isHadiLoading}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsCreateHadiOpen(true)}
              disabled={isLoading || isCompressing}
              title="Tambah Hadi Baru"
              className="p-2.5 rounded-xl border border-border-light bg-bg-main hover:bg-primary/10 hover:border-primary hover:text-primary text-text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon size={18} />
            </button>
          </div>
        </div>
      )}

      <TextArea
        label="Description"
        name="description"
        placeholder="Deskripsi media ini (optional)"
        value={formData.description}
        onChange={handleInputChange}
        error={errors.description}
        disabled={isLoading || isCompressing}
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
          disabled={isLoading || isCompressing}
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
          disabled={isLoading || isCompressing}
        >
          Batal
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading || isCompressing}
        >
          {isCompressing
            ? `Mengkompresi... ${Math.round(compressionProgress * 100)}%`
            : mode === 'edit'
              ? 'Update Audio'
              : 'Upload Audio'}
        </Button>
      </div>

    </form>
    <HadiForm
      isOpen={isCreateHadiOpen}
      onClose={() => setIsCreateHadiOpen(false)}
      onSubmit={handleCreateHadi}
      isLoading={isHadiLoading}
      mode="create"
      error={hadiError}
    />
  </>
  );
};

export const VerseMediaUploadForm: React.FC<VerseMediaFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = 'create',
  initialData,
  error,
  preSelectedVerse,
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
        error={error}
        preSelectedVerse={preSelectedVerse}
      />
    </Modal>
  );
};
