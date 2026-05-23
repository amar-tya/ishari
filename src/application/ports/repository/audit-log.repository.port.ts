import { AuditLogEntity } from '@/core/entities';
import { Result } from '@/core/types';

export interface AuditLogListParams {
  userEmail: string;
  role: string;
  limit?: number;
}

export interface IAuditLogRepository {
  listRecent(params: AuditLogListParams): Promise<Result<AuditLogEntity[]>>;
}
