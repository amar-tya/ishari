import { ChapterMediaEntity, ChapterEntity } from '@/core/entities';
import {
  ChapterMediaApiResponse,
  ListChapterMediaApiResponse,
} from '../models/chapter-media.model';

export class ChapterMediaMapper {
  static toDomain(apiData: ChapterMediaApiResponse): ChapterMediaEntity {
    const domain: ChapterMediaEntity = {
      id: apiData.id,
      chapterId: apiData.chapter_id,
      hadiId: apiData.hadi_id,
      mediaUrl: apiData.media_url,
      fileSize: apiData.file_size,
      duration: apiData.duration,
      description: apiData.description,
      rodadCabang: apiData.rodad_cabang,
      createdAt: new Date(apiData.created_at),
      updatedAt: new Date(apiData.updated_at || apiData.created_at),
    };

    if (apiData.chapters) {
      domain.chapter = {
        id: apiData.chapters.id,
        bookId: apiData.chapters.book_id,
        chapterNumber: apiData.chapters.chapter_number,
        title: apiData.chapters.title,
        category: apiData.chapters.category,
        description: apiData.chapters.description,
        totalVerses: apiData.chapters.total_verses,
        createdAt: apiData.chapters.created_at,
        updatedAt: apiData.chapters.updated_at,
      } as ChapterEntity;
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

  static toEntityList(apiResponse: ListChapterMediaApiResponse) {
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
