import { BookEntity } from './book.entity';

export interface ChapterEntity {
  id: number;
  bookId: number;
  book: BookEntity;
  chapterNumber: number;
  title: string;
  category: string;
  description: string;
  totalVerses: number;
  createdAt: string;
  updatedAt: string;
}
