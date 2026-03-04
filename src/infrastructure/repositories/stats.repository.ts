import { IStatsRepository } from '@/application/ports';
import { DashboardStatsEntity } from '@/core/entities';
import { ServerError } from '@/core/errors';
import { failure, Result, success } from '@/core/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { StatsMapper } from '@/infrastructure/mappers/stats.mapper';

export class StatsRepository implements IStatsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getDashboardStats(): Promise<Result<DashboardStatsEntity>> {
    // Hitung semua stats secara paralel langsung dari Supabase
    const [users, hadis, chapters, verses, verseMedia] = await Promise.all([
      this.supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null),
      this.supabase
        .from('hadi')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null),
      this.supabase
        .from('chapters')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null),
      this.supabase
        .from('verses')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null),
      this.supabase
        .from('verse_media')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null),
    ]);

    const errors = [
      users.error,
      hadis.error,
      chapters.error,
      verses.error,
      verseMedia.error,
    ].filter(Boolean);
    if (errors.length > 0) {
      return failure(new ServerError(errors[0]!.message));
    }

    return success(
      StatsMapper.toDomain({
        total_users: users.count ?? 0,
        total_hadis: hadis.count ?? 0,
        total_chapters: chapters.count ?? 0,
        total_verses: verses.count ?? 0,
        total_verse_media: verseMedia.count ?? 0,
        calculated_at: new Date().toISOString(),
      })
    );
  }
}
