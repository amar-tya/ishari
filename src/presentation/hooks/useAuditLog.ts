import { container } from '@/di/container';
import { AuditLogListParams } from '@/application/ports';
import { useCallback } from 'react';

export const useAuditLog = () => {
  const listRecentAuditLogs = useCallback(async (params: AuditLogListParams) => {
    return await container.listRecentAuditLogsUseCase.execute(params);
  }, []);

  return {
    listRecentAuditLogs,
  };
};
