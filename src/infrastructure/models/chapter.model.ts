import { BookApiResponse } from './book.model';

export interface ListChapterApiResponse {
  data: ChapterApiResponse[];
  meta: ChaperApiMeta;
}

export interface ChapterApiResponse {
  id: string;
  name: string;
  book_id: string; // Changed from bookId to book_id
  book?: BookApiResponse;
  chapter_number: number; // Changed from chapterNumber to chapter_number
  title: string;
  category: string;
  description: string;
  total_verses: number;
  created_at: string;
  updated_at: string;
}

export interface ChaperApiMeta {
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  count: number;
}

export interface ChapterCreateApiRequest {
  book_id: number;
  chapter_number: number;
  title: string;
  category: string;
  description?: string;
  total_verses?: number;
}

export interface ChapterCreateApiResponse {
  id: string;
  book_id: number;
  book?: BookApiResponse;
  chapter_number: number;
  title: string;
  category: string;
  description: string | null;
  total_verses: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateChapterApiResponse {
  status: string;
  message: string;
  data: ChapterCreateApiResponse;
}

export interface ChapterUpdateApiRequest {
  id: string;
  book_id: number;
  chapter_number: number;
  title: string;
  category: string;
  description?: string;
  total_verses?: number;
}

export interface ChapterUpdateApiResponse {
  id: string;
  book_id: number;
  book?: BookApiResponse;
  chapter_number: number;
  title: string;
  category: string;
  description: string | null;
  total_verses: number | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateChapterApiResponse {
  status: string;
  data: ChapterUpdateApiResponse;
}
