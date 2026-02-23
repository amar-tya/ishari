export interface ListUserApiResponse {
  data: UserApiResponse[];
  meta: UserApiMeta;
}

export interface UserApiResponse {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  last_login_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserApiMeta {
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  count: number;
}

export interface UserCreateApiResponse {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdateApiResponse {
  id: number;
  username?: string;
  email?: string;
  is_active?: boolean;
}
