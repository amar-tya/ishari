import { ChapterMediaEntityList } from '@/core/entities';
import { CreateChapterMediaDTO, UpdateChapterMediaDTO } from '@/application/dto';

export interface ChapterMediaViewModel {
  isLoading: boolean;
  error: string | null;
  chapterMediaList: ChapterMediaEntityList | null;
  getChapterMediaList: (
    page?: number,
    search?: string,
    chapterId?: number,
    hadiId?: number,
    options?: { silent?: boolean }
  ) => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setChapterId: (id: number | null) => void;
  setHadiId: (id: number | null) => void;
  storeChapterMedia: (dto: CreateChapterMediaDTO) => Promise<boolean>;
  updateChapterMedia: (
    id: number,
    dto: UpdateChapterMediaDTO
  ) => Promise<boolean>;
  removeChapterMedia: (id: number, storagePath: string) => Promise<boolean>;
}
