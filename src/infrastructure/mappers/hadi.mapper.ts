import { HadiEntity } from '@/core/entities';
import { HadiApiResponse, ListHadiApiResponse } from '../models/hadi.model';

export class HadiMapper {
  static toDomain(apiData: HadiApiResponse): HadiEntity {
    return {
      id: apiData.id,
      name: apiData.name,
      description: apiData.description,
      imageUrl: apiData.image_url,
      createdAt: new Date(apiData.created_at),
      updatedAt: new Date(apiData.updated_at),
    };
  }

  static toEntityList(apiResponse: ListHadiApiResponse) {
    return {
      data: apiResponse.data.map((item) => this.toDomain(item)),
      meta: apiResponse.meta,
    };
  }
}
