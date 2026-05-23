import { IAuditLogRepository, AuditLogListParams } from '@/application/ports';
import { AuditLogEntity } from '@/core/entities';
import { ServerError } from '@/core/errors';
import { failure, Result, success } from '@/core/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuditLogMapper } from '@/infrastructure/mappers/audit-log.mapper';

export class AuditLogRepository implements IAuditLogRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listRecent({ userEmail, role, limit = 25 }: AuditLogListParams): Promise<Result<AuditLogEntity[]>> {
    let query = this.supabase
      .from('audit_logs')
      .select('*, users(username, email)')
      .order('changed_at', { ascending: false })
      .limit(limit);

    if (role !== 'super_admin') {
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (userError || !userData) return success([]);

      query = query.eq('changed_by_user_id', userData.id);
    }

    const { data, error } = await query;

    if (error) return failure(new ServerError(error.message));

    return success((data ?? []).map(AuditLogMapper.toDomain));
  }
}
