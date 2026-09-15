export interface ChapterMediaApiResponse {
  id: number;
  chapter_id: number;
  hadi_id: number | null;
  media_url: string;
  file_size: number | null;
  duration: number | null;
  description: string | null;
  rodad_cabang: string | null;
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
  hadi?: {
    id: number;
    name: string;
    image_url: string | null;
  };
}

export interface ListChapterMediaApiResponse {
  data: ChapterMediaApiResponse[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
    count: number;
  };
}
