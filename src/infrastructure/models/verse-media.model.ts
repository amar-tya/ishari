export interface VerseMediaApiResponse {
  id: number;
  verse_id: number;
  hadi_id: number | null;
  media_type: 'audio' | 'image';
  media_url: string;
  file_size: number | null;
  duration: number | null;
  type: 'Joz' | 'Yahum' | 'Terem' | 'Inat' | 'Rojazz' | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  verses?: {
    id: number;
    chapter_id: number;
    verse_number: number;
    arabic_text: string;
    transliteration: string;
    created_at: string;
    updated_at: string;
    chapters?: {
      id: number;
      book_id: number;
      chapter_number: number;
      title: string;
      category: string;
      description: string;
      total_verses: number;
      created_at: string;
      updated_at: string;
    };
  };
  hadi?: {
    id: number;
    name: string;
    image_url: string | null;
  };
}

export interface ListVerseMediaApiResponse {
  data: VerseMediaApiResponse[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
    count: number;
  };
}
