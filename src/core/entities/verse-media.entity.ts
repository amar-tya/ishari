export interface VerseMediaEntity {
  id: number;
  verseId: number;
  hadiId: number | null;
  mediaType: 'audio' | 'image';
  mediaUrl: string;
  fileSize: number | null;
  duration: number | null;
  type: 'Joz' | 'Yahum' | 'Terem' | 'Inat' | 'Rojazz' | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerseMediaEntityList {
  data: VerseMediaEntity[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
    count: number;
  };
}
