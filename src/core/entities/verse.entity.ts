import { ChapterEntity } from './chapter.entity';

export interface VerseEntity {
  id: number;
  chapterId: number;
  chapter?: ChapterEntity;
  verseNumber: number;
  arabicText: string;
  transliteration: string;
  createdAt: string;
  updatedAt: string;
  verseMedia?: { id: number; mediaType: string }[];
}
