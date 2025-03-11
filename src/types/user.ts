
export interface UserWithRole {
  id: string;
  username: string;
  telegram: string | null;
  created_at: string;
  last_active?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  user_role: {
    role: 'admin' | 'client';
    id?: string;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
  } | null;
}

export type UserStatus = 'online' | 'offline' | 'deleted' | 'new';
