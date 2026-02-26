export interface HadiApiResponse {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ListHadiApiResponse {
  data: HadiApiResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    count: number;
  };
}
