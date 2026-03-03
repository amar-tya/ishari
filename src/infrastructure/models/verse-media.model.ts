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
