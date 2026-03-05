import { ChapterApiResponse } from './chapter.model';

export interface ListVerseApiResponse {
  data: VerseApiResponse[];
  meta: VerseApiMeta;
}

export interface VerseApiMeta {
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  count: number;
}

export interface VerseApiResponse {
  id: string;
  chapter_id: number;
  chapter: ChapterApiResponse;
  verse_number: number;
  arabic_text: string;
  transliteration: string;
  created_at: string;
  updated_at: string;
  verse_media?: { id: number; media_type: string; hadi_id?: number | null }[];
}

export interface CreateVerseApiResponse {
  id: string;
  chapter_id: number;
  chapter: ChapterApiResponse;
  verse_number: number;
  arabic_text: string;
  transliteration: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateVerseApiResponse {
  id: string;
  chapter_id: number;
  chapter: ChapterApiResponse;
  verse_number: number;
  arabic_text: string;
  transliteration: string;
  created_at: string;
  updated_at: string;
}

export interface VerseCreateApiRequest {
  chapter_id: number;
  verse_number: number;
  arabic_text: string;
  transliteration?: string;
}

export interface VerseUpdateApiRequest {
  chapter_id?: number;
  verse_number?: number;
  arabic_text?: string;
  transliteration?: string;
}
