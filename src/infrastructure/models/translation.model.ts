export interface ListTranslationApiResponse {
  data: TranslationApiResponse[];
  meta: TranslationApiMeta;
}

export interface TranslationApiResponse {
  id: number;
  verse_id: number;
  language_code: string;
  translation_text: string;
  translator_name: string;
  created_at: string;
  updated_at: string;
  verse: VerseTranslationApiResponse;
}

export interface VerseTranslationApiResponse {
  id: number;
  arabic_text: string;
  verse_number?: number;
  chapter?: {
    id: number;
    chapter_number: number;
    title: string;
  };
}

export interface TranslationApiMeta {
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  count: number;
}

export interface TranslationCreateApiRequest {
  verse_id: number;
  language_code: string;
  translation_text: string;
  translator_name: string;
}

export interface TranslationCreateApiResponse {
  id: number;
  verse_id: number;
  language_code: string;
  translation_text: string;
  translator_name: string;
  created_at: string;
  updated_at: string;
  verse: VerseTranslationApiResponse;
}

export interface TranslationUpdateApiRequest {
  id: number;
  verse_id?: number;
  language_code?: string;
  translation_text?: string;
  translator_name?: string;
}

export interface TranslationUpdateApiResponse {
  id: number;
  verse_id: number;
  language_code: string;
  translation_text: string;
  translator_name: string;
  created_at: string;
  updated_at: string;
  verse: VerseTranslationApiResponse;
}

export interface VerseDropdownApiResponse {
  id: number;
  arabic_text: string;
}

export interface TranslationDropdownApiResponse {
  verses: VerseDropdownApiResponse[];
  translator_names: string[];
  language_codes: string[];
}
