import {
  CreateChapterMediaDTO,
  IChapterMediaRepository,
  ListChapterMediaDTO,
  UpdateChapterMediaDTO,
} from '@/application';
import { ChapterMediaEntity, ChapterMediaEntityList } from '@/core/entities';
import { ServerError } from '@/core/errors';
import { failure, Result, success } from '@/core/types';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  ChapterMediaApiResponse,
  ListChapterMediaApiResponse,
} from '@/infrastructure/models';
import { ChapterMediaMapper } from '@/infrastructure/mappers';

export class ChapterMediaRepository implements IChapterMediaRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async upload(
    dto: CreateChapterMediaDTO
  ): Promise<Result<ChapterMediaEntity>> {
    try {
      const { data: sessionData } = await this.supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        throw new Error('No active session. Please log in again.');
      }

      const { data: uploadData, error: uploadError } =
        await this.supabase.storage
          .from('chapter-media')
          .upload(dto.storagePath, dto.file, {
            upsert: true,
            contentType: dto.file.type || 'audio/mpeg',
          });

      if (uploadError) {
        throw new Error(uploadError.message || 'Failed to upload audio');
      }

      const { data: publicUrlData } = this.supabase.storage
        .from('chapter-media')
        .getPublicUrl(uploadData.path);

      const mediaUrl = publicUrlData.publicUrl;

      const { data: dbData, error: dbError } = await this.supabase
        .from('chapter_media')
        .insert({
          chapter_id: dto.chapterId,
          hadi_id: dto.hadiId ?? null,
          media_url: mediaUrl,
          file_size: dto.file.size,
          description: dto.description ?? null,
          rodad_cabang: dto.rodadCabang ?? null,
        })
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);

      return success(
        ChapterMediaMapper.toDomain(dbData as ChapterMediaApiResponse)
      );
    } catch (error) {
      const err = error as Error;
      return failure(new ServerError(err.message));
    }
  }

  async update(
    id: number,
    dto: UpdateChapterMediaDTO
  ): Promise<Result<ChapterMediaEntity>> {
    try {
      let mediaUrl: string | undefined = undefined;
      let fileSize: number | undefined = undefined;

      if (dto.file && dto.storagePath) {
        const { data: sessionData } = await this.supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token;

        if (!accessToken) {
          throw new Error('No active session. Please log in again.');
        }

        const { error: uploadError } = await this.supabase.storage
          .from('chapter-media')
          .upload(dto.storagePath, dto.file, {
            upsert: true,
            contentType: dto.file.type || 'audio/mpeg',
          });

        if (uploadError) {
          throw new Error(uploadError.message || 'Failed to upload new audio');
        }

        const { data: publicUrlData } = this.supabase.storage
          .from('chapter-media')
          .getPublicUrl(dto.storagePath);

        mediaUrl = publicUrlData.publicUrl;
        fileSize = dto.file.size;
      }

      const updatePayload: Record<string, unknown> = {};
      if (dto.description !== undefined)
        updatePayload.description = dto.description;
      if (dto.rodadCabang !== undefined)
        updatePayload.rodad_cabang = dto.rodadCabang;
      if (mediaUrl !== undefined) updatePayload.media_url = mediaUrl;
      if (fileSize !== undefined) updatePayload.file_size = fileSize;

      const { data, error } = await this.supabase
        .from('chapter_media')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return success(
        ChapterMediaMapper.toDomain(data as ChapterMediaApiResponse)
      );
    } catch (error) {
      const err = error as Error;
      return failure(new ServerError(err.message));
    }
  }

  async delete(id: number, storagePath: string): Promise<Result<void>> {
    try {
      const { error: storageError } = await this.supabase.storage
        .from('chapter-media')
        .remove([storagePath]);

      if (storageError) {
        console.error('Failed to delete from storage:', storageError);
      }

      const { error: dbError } = await this.supabase
        .from('chapter_media')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (dbError) throw new Error(dbError.message);

      return success(undefined);
    } catch (error) {
      const err = error as Error;
      return failure(new ServerError(err.message));
    }
  }

  async getById(id: number): Promise<Result<ChapterMediaEntity>> {
    const { data, error } = await this.supabase
      .from('chapter_media')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(
      ChapterMediaMapper.toDomain(data as ChapterMediaApiResponse)
    );
  }

  async getAll(
    dto: ListChapterMediaDTO
  ): Promise<Result<ChapterMediaEntityList>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('chapter_media')
      .select('*, chapters(id, book_id, chapter_number, title, category)', {
        count: 'exact',
      })
      .is('deleted_at', null)
      .range(from, to)
      .order('id', { ascending: false });

    if (dto.search) {
      query = query.ilike('description', `%${dto.search}%`);
    }

    if (dto.chapterId) {
      query = query.eq('chapter_id', dto.chapterId);
    }

    if (dto.hadiId) {
      query = query.eq('hadi_id', dto.hadiId);
    }

    const { data, error, count } = await query;

    if (error) return failure(new ServerError(error.message));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const apiResponse: ListChapterMediaApiResponse = {
      data: (data ?? []) as unknown as ChapterMediaApiResponse[],
      meta: {
        total,
        total_pages: totalPages,
        page,
        limit,
        count: data?.length ?? 0,
      },
    };

    return success(ChapterMediaMapper.toEntityList(apiResponse));
  }
}
