import {
  CreateVerseMediaDTO,
  IVerseMediaRepository,
  ListVerseMediaDTO,
  UpdateVerseMediaDTO,
} from '@/application';
import { VerseMediaEntity, VerseMediaEntityList } from '@/core/entities';
import { ServerError } from '@/core/errors';
import { failure, Result, success } from '@/core/types';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  VerseMediaApiResponse,
  ListVerseMediaApiResponse,
} from '@/infrastructure/models';
import { VerseMediaMapper } from '@/infrastructure/mappers';

export class VerseMediaRepository implements IVerseMediaRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async upload(dto: CreateVerseMediaDTO): Promise<Result<VerseMediaEntity>> {
    try {
      // 1. Upload via Edge Function (handles transcoding and storage)
      const formData = new FormData();
      formData.append('file', dto.file);
      formData.append('path', dto.storagePath);

      const { error: edgeError } = await this.supabase.functions.invoke(
        'transcode-audio',
        {
          body: formData,
        }
      );

      if (edgeError) {
        throw new Error(
          edgeError.message || 'Failed to transcode and upload audio'
        );
      }

      // 2. Get public URL from storage
      const { data: publicUrlData } = this.supabase.storage
        .from('verse-media')
        .getPublicUrl(dto.storagePath);

      const mediaUrl = publicUrlData.publicUrl;

      // 3. Insert record into database
      const { data: dbData, error: dbError } = await this.supabase
        .from('verse_media')
        .insert({
          verse_id: dto.verseId,
          hadi_id: dto.hadiId ?? null,
          media_type: dto.mediaType,
          media_url: mediaUrl,
          file_size: dto.file.size,
          type: dto.type ?? null,
          description: dto.description ?? null,
        })
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);

      return success(
        VerseMediaMapper.toDomain(dbData as VerseMediaApiResponse)
      );
    } catch (error) {
      const err = error as Error;
      return failure(new ServerError(err.message));
    }
  }

  async update(
    id: number,
    dto: UpdateVerseMediaDTO
  ): Promise<Result<VerseMediaEntity>> {
    try {
      let mediaUrl: string | undefined = undefined;
      let fileSize: number | undefined = undefined;

      // If file is provided, we need to upload/replace it
      if (dto.file && dto.storagePath) {
        const formData = new FormData();
        formData.append('file', dto.file);
        formData.append('path', dto.storagePath);

        const { error: edgeError } = await this.supabase.functions.invoke(
          'transcode-audio',
          {
            body: formData,
          }
        );

        if (edgeError) {
          throw new Error(
            edgeError.message || 'Failed to transcode and upload new audio'
          );
        }

        const { data: publicUrlData } = this.supabase.storage
          .from('verse-media')
          .getPublicUrl(dto.storagePath);

        mediaUrl = publicUrlData.publicUrl;
        fileSize = dto.file.size;
      }

      const updatePayload: Record<string, unknown> = {};
      if (dto.description !== undefined)
        updatePayload.description = dto.description;
      if (dto.type !== undefined) updatePayload.type = dto.type;
      if (mediaUrl !== undefined) updatePayload.media_url = mediaUrl;
      if (fileSize !== undefined) updatePayload.file_size = fileSize;

      const { data, error } = await this.supabase
        .from('verse_media')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return success(VerseMediaMapper.toDomain(data as VerseMediaApiResponse));
    } catch (error) {
      const err = error as Error;
      return failure(new ServerError(err.message));
    }
  }

  async delete(id: number, storagePath: string): Promise<Result<void>> {
    try {
      // 1. Delete from storage
      const { error: storageError } = await this.supabase.storage
        .from('verse-media')
        .remove([storagePath]);

      if (storageError) {
        console.error('Failed to delete from storage:', storageError);
        // Continue to delete from DB even if storage deletion fails
      }

      // 2. Soft delete from database
      const { error: dbError } = await this.supabase
        .from('verse_media')
        .delete()
        .eq('id', id);

      if (dbError) throw new Error(dbError.message);

      return success(undefined);
    } catch (error) {
      const err = error as Error;
      return failure(new ServerError(err.message));
    }
  }

  async getById(id: number): Promise<Result<VerseMediaEntity>> {
    const { data, error } = await this.supabase
      .from('verse_media')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(VerseMediaMapper.toDomain(data as VerseMediaApiResponse));
  }

  async getAll(dto: ListVerseMediaDTO): Promise<Result<VerseMediaEntityList>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('verse_media')
      .select('*, verses(chapter_id, verse_number)', { count: 'exact' })
      .is('deleted_at', null)
      .range(from, to)
      .order('id', { ascending: false });

    if (dto.search) {
      query = query.ilike('description', `%${dto.search}%`);
    }

    if (dto.verseId) {
      query = query.eq('verse_id', dto.verseId);
    }

    if (dto.hadiId) {
      query = query.eq('hadi_id', dto.hadiId);
    }

    if (dto.type) {
      query = query.eq('type', dto.type);
    }

    const { data, error, count } = await query;

    if (error) return failure(new ServerError(error.message));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const apiResponse: ListVerseMediaApiResponse = {
      data: (data ?? []) as unknown as VerseMediaApiResponse[],
      meta: {
        total,
        total_pages: totalPages,
        page,
        limit,
        count: data?.length ?? 0,
      },
    };

    return success(VerseMediaMapper.toEntityList(apiResponse));
  }
}
