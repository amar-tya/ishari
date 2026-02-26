export interface BookmarkEntity {
  id: number;
  userId: number;
  verseId: number;
  note?: string;
  createdAt: string;
  deletedAt?: string;
}
