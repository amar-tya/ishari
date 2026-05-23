export interface AuditLogEntity {
  id: number;
  tableName: string;
  recordId: number;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  changedByUserId: number | null;
  changedByUserName: string | null;
  changedAt: string;
}
