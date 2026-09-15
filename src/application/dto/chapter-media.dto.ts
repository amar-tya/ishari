import { ChapterMediaEntity } from '@/core/entities';

export interface CreateChapterMediaDTO {
  chapterId: number;
  hadiId?: number;
  file: File;
  description?: string;
  rodadCabang?: string;
  storagePath: string; // The path to save in Supabase Storage
}

export interface UpdateChapterMediaDTO {
  description?: string;
  rodadCabang?: string;
  file?: File;
  storagePath?: string;
}

export interface ListChapterMediaDTO {
  page: number;
  limit?: number;
  search?: string;
  chapterId?: number;
  hadiId?: number;
}

export interface ListChapterMediaResponseDTO {
  data: ChapterMediaEntity[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
    count: number;
  };
}
