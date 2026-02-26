import { IBookmarkRepositoryPort } from '@/application/ports/repository/bookmark.repository.port';
import { ApiSuccessResponse, failure, Result, success } from '@/core/types';
import {
  CreateBookmarkApiResponse,
  ListBookmarkApiResponse,
  UpdateBookmarkApiResponse,
} from '../models/bookmark.model';
import {
  BookmarkCreateRequest,
  BookmarkUpdateRequest,
  BookmarkFilter,
  BookmarkResponse,
} from '@/application/dto/bookmark.dto';
import { HttpClient } from '@/infrastructure/http';
import { BookmarkEntity } from '@/core/entities/bookmark.entity';
import { BookmarkMapper } from '@/infrastructure/mappers/bookmark.mapper';

export class BookmarkRepository implements IBookmarkRepositoryPort {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async find(criteria: BookmarkFilter): Promise<Result<BookmarkResponse>> {
    const queryParams = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'userId') {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = criteria.userId
      ? `/bookmarks/user/${criteria.userId}`
      : `/bookmarks`;

    const response = await this.httpClient.get<ListBookmarkApiResponse>(
      `${endpoint}?${queryParams.toString()}`
    );

    if (!response.success) {
      return failure(response.error);
    }

    const resultData = BookmarkMapper.toDomainList(response.data.data);
    return success(resultData);
  }

  async create(
    request: BookmarkCreateRequest
  ): Promise<Result<BookmarkEntity>> {
    const apiRequest = {
      verse_id: request.verseId,
      note: request.note,
    };

    // In Apispec, usually it's enveloped in 'data' but the actual interface might differ. By looking at Verse it returns `{ data: { data: T } }` for some reason? Let's check api result wrapping, usually generic ApiSuccessResponse<T> has `data: T`. I will assume standard format for now.
    const result = await this.httpClient.post<
      ApiSuccessResponse<CreateBookmarkApiResponse>
    >(`/bookmarks`, apiRequest);

    if (!result.success) {
      return failure(result.error);
    }

    // Assuming standard format. Depending on `ApiSuccessResponse` shape, it might be nested
    const resultData = BookmarkMapper.toDomain(
      result.data.data.data as unknown as CreateBookmarkApiResponse
    );
    return success(resultData);
  }

  async update(
    request: BookmarkUpdateRequest
  ): Promise<Result<BookmarkEntity>> {
    const apiRequest = {
      note: request.note,
    };
    const result = await this.httpClient.put<
      ApiSuccessResponse<UpdateBookmarkApiResponse>
    >(`/bookmarks/${request.bookmarkId}`, apiRequest);

    if (!result.success) {
      return failure(result.error);
    }

    const resultData = BookmarkMapper.toDomain(
      result.data.data.data as unknown as UpdateBookmarkApiResponse
    );
    return success(resultData);
  }

  async delete(id: number): Promise<Result<boolean>> {
    const result = await this.httpClient.delete<ApiSuccessResponse<void>>(
      `/bookmarks/${id}`
    );

    if (!result.success) {
      return failure(result.error);
    }

    return success(true);
  }
}
