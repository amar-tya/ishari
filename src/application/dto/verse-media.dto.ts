import { VerseMediaEntity } from '@/core/entities';

export interface CreateVerseMediaDTO {
  verseId: number;
  hadiId?: number;
  mediaType: 'audio' | 'image';
  file: File;
  description?: string;
  type?: 'Joz' | 'Yahum' | 'Terem' | 'Inat' | 'Rojazz';
  storagePath: string; // The path to save in Supabase Storage
}

export interface UpdateVerseMediaDTO {
  description?: string;
  type?: 'Joz' | 'Yahum' | 'Terem' | 'Inat' | 'Rojazz';
  file?: File;
  storagePath?: string;
}

export interface ListVerseMediaDTO {
  page: number;
  limit?: number;
  search?: string;
  verseId?: number;
  hadiId?: number;
  type?: 'Joz' | 'Yahum' | 'Terem' | 'Inat' | 'Rojazz';
}

export interface ListVerseMediaResponseDTO {
  data: VerseMediaEntity[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
    count: number;
  };
}
