import { VerseMediaEntity } from '@/core/entities';
import {
  VerseMediaApiResponse,
  ListVerseMediaApiResponse,
} from '../models/verse-media.model';

export class VerseMediaMapper {
  static toDomain(apiData: VerseMediaApiResponse): VerseMediaEntity {
    return {
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
