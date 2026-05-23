import { AuditLogEntity } from '@/core/entities';
import { AuditLogApiResponse } from '../models/audit-log.model';

export class AuditLogMapper {
  static toDomain(apiData: AuditLogApiResponse): AuditLogEntity {
    return {
      id: apiData.id,
      tableName: apiData.table_name,
      recordId: apiData.record_id,
      operation: apiData.operation as 'INSERT' | 'UPDATE' | 'DELETE',
      changedByUserId: apiData.changed_by_user_id,
      changedByUserName: apiData.users?.username ?? null,
      changedAt: apiData.changed_at,
    };
  }
}
