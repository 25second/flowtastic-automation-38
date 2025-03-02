
export interface UserWithRole {
  id: string;
  username: string;
  telegram: string | null;
  created_at: string;
  user_role: {
    role: 'admin' | 'client';
  } | null;
}
