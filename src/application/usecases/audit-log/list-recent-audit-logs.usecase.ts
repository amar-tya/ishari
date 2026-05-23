import { IAuditLogRepository, AuditLogListParams } from '../../ports';
import { AuditLogEntity } from '@/core/entities';
import { Result } from '@/core/types';

export class ListRecentAuditLogsUseCase {
  constructor(private readonly repository: IAuditLogRepository) {}

  async execute(params: AuditLogListParams): Promise<Result<AuditLogEntity[]>> {
    return this.repository.listRecent(params);
  }
}
