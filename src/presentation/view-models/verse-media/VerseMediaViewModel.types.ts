import { VerseMediaEntityList } from '@/core/entities';
import { CreateVerseMediaDTO, UpdateVerseMediaDTO } from '@/application/dto';

export interface VerseMediaViewModel {
  isLoading: boolean;
  error: string | null;
  verseMediaList: VerseMediaEntityList | null;
  getVerseMediaList: (
    page?: number,
    search?: string,
    hadiId?: number,
    verseId?: number,
    options?: { silent?: boolean }
  ) => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setHadiId: (id: number | null) => void;
  setVerseId: (id: number | null) => void;
  storeVerseMedia: (dto: CreateVerseMediaDTO) => Promise<boolean>;
  updateVerseMedia: (id: number, dto: UpdateVerseMediaDTO) => Promise<boolean>;
  removeVerseMedia: (id: number, storagePath: string) => Promise<boolean>;
}
