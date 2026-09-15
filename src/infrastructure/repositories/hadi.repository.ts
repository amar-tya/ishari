import {
  CreateHadiDTO,
  IHadiRepository,
  ListHadiDTO,
  UpdateHadiDTO,
} from '@/application';
import { HadiEntity, HadiEntityList } from '@/core/entities';
import { ServerError } from '@/core/errors';
import { failure, Result, success } from '@/core/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { HadiApiResponse, ListHadiApiResponse } from '@/infrastructure/models';
import { HadiMapper } from '@/infrastructure/mappers';

const HADI_PHOTOS_BUCKET = 'hadi-photos';

function extractStoragePath(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/${HADI_PHOTOS_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.substring(idx + marker.length);
}

export class HadiRepository implements IHadiRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  private async uploadPhoto(photo: File): Promise<string> {
    const ext = (photo.name.match(/\.[0-9a-z]+$/i)?.[0] ?? '').toLowerCase();
    const slug = photo.name
      .replace(/\.[0-9a-z]+$/i, '')
      .replace(/[^a-zA-Z0-9.\-_]/g, '-')
      .toLowerCase();
    const storagePath = `${slug}-${Date.now()}${ext}`;

    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from(HADI_PHOTOS_BUCKET)
      .upload(storagePath, photo, {
        upsert: true,
        contentType: photo.type || 'image/jpeg',
      });

    if (uploadError) {
      throw new Error(uploadError.message || 'Failed to upload photo');
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(HADI_PHOTOS_BUCKET)
      .getPublicUrl(uploadData.path);

    return publicUrlData.publicUrl;
  }

  private async deletePhoto(imageUrl: string | null | undefined) {
    const storagePath = extractStoragePath(imageUrl);
    if (!storagePath) return;
    const { error } = await this.supabase.storage
      .from(HADI_PHOTOS_BUCKET)
      .remove([storagePath]);
    if (error) {
      console.error('Failed to delete hadi photo from storage:', error);
    }
  }

  async create(dto: CreateHadiDTO): Promise<Result<HadiEntity>> {
    try {
      const imageUrl = dto.photo
        ? await this.uploadPhoto(dto.photo)
        : (dto.image_url ?? null);

      const { data, error } = await this.supabase
        .from('hadi')
        .insert({
          name: dto.name,
          description: dto.description ?? null,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return success(HadiMapper.toDomain(data as HadiApiResponse));
    } catch (error) {
      const err = error as Error;
      return failure(new ServerError(err.message));
    }
  }

  async update(id: number, dto: UpdateHadiDTO): Promise<Result<HadiEntity>> {
    try {
      const updatePayload: Record<string, unknown> = {
        name: dto.name,
        description: dto.description ?? null,
      };

      if (dto.photo) {
        const { data: existing } = await this.supabase
          .from('hadi')
          .select('image_url')
          .eq('id', id)
          .single();

        updatePayload.image_url = await this.uploadPhoto(dto.photo);

        if (existing?.image_url) {
          await this.deletePhoto(existing.image_url);
        }
      } else if (dto.image_url !== undefined) {
        updatePayload.image_url = dto.image_url;
      }

      const { data, error } = await this.supabase
        .from('hadi')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return success(HadiMapper.toDomain(data as HadiApiResponse));
    } catch (error) {
      const err = error as Error;
      return failure(new ServerError(err.message));
    }
  }

  async delete(id: number): Promise<Result<void>> {
    const { data: existing } = await this.supabase
      .from('hadi')
      .select('image_url')
      .eq('id', id)
      .single();

    const { error } = await this.supabase.from('hadi').delete().eq('id', id);
    if (error) return failure(new ServerError(error.message));

    if (existing?.image_url) {
      await this.deletePhoto(existing.image_url);
    }

    return success(undefined);
  }

  async getById(id: number): Promise<Result<HadiEntity>> {
    const { data, error } = await this.supabase
      .from('hadi')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) return failure(new ServerError(error.message));
    return success(HadiMapper.toDomain(data as HadiApiResponse));
  }

  async getAll(dto: ListHadiDTO): Promise<Result<HadiEntityList>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('hadi')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .range(from, to)
      .order('id', { ascending: false });

    if (dto.search) {
      query = query.ilike('name', `%${dto.search}%`);
    }

    const { data, error, count } = await query;

    if (error) return failure(new ServerError(error.message));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    const apiResponse: ListHadiApiResponse = {
      data: (data ?? []) as HadiApiResponse[],
      meta: {
        total,
        total_pages: totalPages,
        page,
        limit,
        count: data?.length ?? 0,
      },
    };

    return success(HadiMapper.toEntityList(apiResponse));
  }
}
