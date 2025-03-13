
export type UserWithRole = {
  id: string;
  username?: string | null;
  telegram?: string | null;
  is_deleted?: boolean;
  created_at: string;
  last_active?: string | null;
};

export type UserStatus = 'online' | 'offline' | 'new' | 'deleted';
