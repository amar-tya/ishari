import { VerseEntity } from '@/core/entities';
import { PaginationResponse } from './pagination.dto';

export interface VerseRequest {
  page: number;
  limit?: number;
  search?: string;
  chapterId?: number;
  arabicText?: string;
  transliteration?: string;
  verseIds?: number[];
}

export interface VerseResponse {
  data: VerseEntity[];
  meta: PaginationResponse;
}

export interface VerseCreateRequest {
  chapterId: number;
  verseNumber: number;
  arabicText: string;
  transliteration?: string;
}

export interface VerseUpdateRequest {
  verseId: number;
  chapterId?: number;
  verseNumber?: number;
  arabicText?: string;
  transliteration?: string;
}
