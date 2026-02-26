import { HadiEntity } from '@/core/entities';

export interface CreateHadiDTO {
  name: string;
  description?: string;
  image_url?: string;
}

export interface UpdateHadiDTO {
  name?: string;
  description?: string;
  image_url?: string;
}

export interface ListHadiDTO {
  page: number;
  limit?: number;
  search?: string;
}

export interface ListHadiResponseDTO {
  data: HadiEntity[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
    count: number;
  };
}
