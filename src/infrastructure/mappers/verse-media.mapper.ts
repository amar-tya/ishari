import { VerseMediaEntity, ChapterEntity } from '@/core/entities';
import {
  VerseMediaApiResponse,
  ListVerseMediaApiResponse,
} from '../models/verse-media.model';

export class VerseMediaMapper {
  static toDomain(apiData: VerseMediaApiResponse): VerseMediaEntity {
    const domain: VerseMediaEntity = {
      id: apiData.id,
      verseId: apiData.verse_id,
      hadiId: apiData.hadi_id,
      mediaType: apiData.media_type,
      mediaUrl: apiData.media_url,
      fileSize: apiData.file_size,
      duration: apiData.duration,
      type: apiData.type,
      description: apiData.description,
      createdAt: new Date(apiData.created_at),
      updatedAt: new Date(apiData.updated_at || apiData.created_at),
    };

    if (apiData.verses) {
      domain.verse = {
        id: apiData.verses.id,
        chapterId: apiData.verses.chapter_id,
        verseNumber: apiData.verses.verse_number,
        arabicText: apiData.verses.arabic_text,
        transliteration: apiData.verses.transliteration,
        createdAt: apiData.verses.created_at,
        updatedAt: apiData.verses.updated_at,
        chapter: apiData.verses.chapters
          ? ({
              id: apiData.verses.chapters.id,
              bookId: apiData.verses.chapters.book_id,
              chapterNumber: apiData.verses.chapters.chapter_number,
              title: apiData.verses.chapters.title,
              category: apiData.verses.chapters.category,
              description: apiData.verses.chapters.description,
              totalVerses: apiData.verses.chapters.total_verses,
              createdAt: apiData.verses.chapters.created_at,
              updatedAt: apiData.verses.chapters.updated_at,
            } as ChapterEntity)
          : undefined,
      };
    }

    if (apiData.hadi) {
      domain.hadi = {
        id: apiData.hadi.id,
        name: apiData.hadi.name,
        imageUrl: apiData.hadi.image_url,
      };
    }

    return domain;
  }

  static toEntityList(apiResponse: ListVerseMediaApiResponse) {
    return {
      data: apiResponse.data.map((item) => this.toDomain(item)),
      meta: {
        total: apiResponse.meta.total,
        totalPages: apiResponse.meta.total_pages,
        page: apiResponse.meta.page,
        limit: apiResponse.meta.limit,
        count: apiResponse.meta.count,
      },
    };
  }
}
