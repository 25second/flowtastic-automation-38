
export interface UserWithRole {
  id: string;
  username: string;
  telegram: string | null;
  created_at: string;
  user_role: {
    role: 'admin' | 'client';
    id?: string;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
  } | null;
}
