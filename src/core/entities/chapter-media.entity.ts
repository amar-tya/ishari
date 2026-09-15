import { ChapterEntity } from './chapter.entity';

export interface ChapterMediaEntity {
  id: number;
  chapterId: number;
  hadiId: number | null;
  mediaUrl: string;
  fileSize: number | null;
  duration: number | null;
  description: string | null;
  rodadCabang: string | null;
  createdAt: Date;
  updatedAt: Date;
  chapter?: ChapterEntity;
  hadi?: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
}

export interface ChapterMediaEntityList {
  data: ChapterMediaEntity[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
    count: number;
  };
}
