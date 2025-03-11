
import { UserWithRole, UserStatus } from '@/types/user';

const ONLINE_THRESHOLD = 15 * 60 * 1000; // 15 minutes in milliseconds

export const isUserOnline = (lastActive?: string | null): boolean => {
  if (!lastActive) return false;
  const now = new Date();
  const lastActiveDate = new Date(lastActive);
  return (now.getTime() - lastActiveDate.getTime()) < ONLINE_THRESHOLD;
};

export const getUserStatus = (user: UserWithRole): UserStatus => {
  if (user.is_deleted) return 'deleted';
  
  if (user.last_active && isUserOnline(user.last_active)) {
    return 'online';
  }
  
  const now = new Date();
  const createdDate = new Date(user.created_at);
  const isLessThan24Hours = (now.getTime() - createdDate.getTime()) < 24 * 60 * 60 * 1000;
  
  if (isLessThan24Hours) return 'new';
  
  return 'offline';
};

export const filterUsers = (
  users: UserWithRole[],
  searchQuery: string,
  statusFilter: string
) => {
  return users
    .filter(user => 
      searchQuery.trim() === '' || 
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.telegram && user.telegram.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(user => {
      if (statusFilter === 'all') return true;
      return getUserStatus(user) === statusFilter;
    });
};

export const getOnlineUsersCount = (users: UserWithRole[]): number => {
  return users.filter(user => getUserStatus(user) === 'online').length;
};
