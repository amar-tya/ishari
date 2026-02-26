export interface ListBookmarkApiResponse {
  data: BookmarkApiResponse[];
  meta: BookmarkApiMeta;
}

export interface BookmarkApiMeta {
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  count: number;
}

export interface BookmarkApiResponse {
  id: number;
  user_id: number;
  verse_id: number;
  note?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateBookmarkApiResponse extends BookmarkApiResponse {}
export interface UpdateBookmarkApiResponse extends BookmarkApiResponse {}

export interface BookmarkCreateApiRequest {
  verse_id: number;
  note: string;
}

export interface BookmarkUpdateApiRequest {
  note: string;
}
