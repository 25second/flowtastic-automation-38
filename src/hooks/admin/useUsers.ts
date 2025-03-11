
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserWithRole } from '@/types/user';
import { toast } from 'sonner';

export function useUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'deleted' | 'new'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      
      const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000).toISOString();
      const { data: activeSessions, error: activeSessionsError } = await supabase
        .from('active_sessions')
        .select('user_id, last_active')
        .gte('last_active', fifteenMinutesAgo);
        
      if (activeSessionsError) throw activeSessionsError;
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (profilesError) throw profilesError;
      
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
        
      if (rolesError) throw rolesError;
      
      const usersWithRoles: UserWithRole[] = profilesData.map((profile: any) => {
        const userRole = rolesData.find((role: any) => role.user_id === profile.id);
        const userSession = activeSessions?.find((session: any) => session.user_id === profile.id);
        
        return {
          ...profile,
          last_active: userSession?.last_active || null,
          user_role: userRole ? { role: userRole.role } : null
        };
      });
      
      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'client') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole
        });

      if (error) throw error;

      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            user_role: { role: newRole }
          };
        }
        return user;
      }));

      toast.success(`User role updated to ${newRole}`);
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleBulkUpdateRole = async (newRole: 'admin' | 'client') => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }

    try {
      const promises = selectedUsers.map(userId => 
        supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: newRole
          })
      );
      
      const results = await Promise.all(promises);
      
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Some role updates failed:', errors);
        toast.error(`${errors.length} role updates failed`);
      } else {
        setUsers(users.map(user => {
          if (selectedUsers.includes(user.id)) {
            return {
              ...user,
              user_role: { role: newRole }
            };
          }
          return user;
        }));
        
        toast.success(`Updated ${selectedUsers.length} users to ${newRole} role`);
        setSelectedUsers([]);
      }
    } catch (error: any) {
      console.error('Error updating roles in bulk:', error);
      toast.error('Failed to update user roles');
    }
  };

  return {
    users,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedUsers,
    setSelectedUsers,
    handleUpdateRole,
    handleBulkUpdateRole,
  };
}
