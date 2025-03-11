
import { UserWithRole, UserStatus } from '@/types/user';

export const getUserStatus = (user: UserWithRole): UserStatus => {
  if (user.is_deleted) return 'deleted';
  
  if (user.last_active) {
    const now = new Date();
    const lastActive = new Date(user.last_active);
    const isWithin15Minutes = (now.getTime() - lastActive.getTime()) < 15 * 60 * 1000;
    if (isWithin15Minutes) return 'online';
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
