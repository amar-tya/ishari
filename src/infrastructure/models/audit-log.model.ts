export interface AuditLogUserModel {
  username: string;
  email: string;
}

export interface AuditLogApiResponse {
  id: number;
  table_name: string;
  record_id: number;
  operation: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  changed_by_user_id: number | null;
  changed_at: string;
  users: AuditLogUserModel | null;
}
