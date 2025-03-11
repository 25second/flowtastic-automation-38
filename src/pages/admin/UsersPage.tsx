
import { useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';
import { UserWithRole, UserStatus } from '@/types/user';
import { UserSearch } from '@/components/admin/users/UserSearch';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { UserActions } from '@/components/admin/users/UserActions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const { role } = useUserRole();

  useEffect(() => {
    fetchUsers();
  }, []);
  
  async function fetchUsers() {
    try {
      setLoading(true);
      
      // Fetch active sessions to determine online status
      const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000).toISOString();
      const { data: activeSessions, error: activeSessionsError } = await supabase
        .from('active_sessions')
        .select('user_id, last_active')
        .gte('last_active', fifteenMinutesAgo);
        
      if (activeSessionsError) throw activeSessionsError;
      
      // First fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (profilesError) throw profilesError;
      
      // Then fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
        
      if (rolesError) throw rolesError;
      
      // Manually join the data
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

      // Update local state
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

  const getUserStatus = (user: UserWithRole): UserStatus => {
    const now = new Date();
    const createdDate = new Date(user.created_at);
    const isLessThan24Hours = (now.getTime() - createdDate.getTime()) < 24 * 60 * 60 * 1000;
    
    if (user.is_deleted) return 'deleted';
    if (isLessThan24Hours) return 'new';
    if (user.last_active) {
      const lastActive = new Date(user.last_active);
      const isWithin15Minutes = (now.getTime() - lastActive.getTime()) < 15 * 60 * 1000;
      return isWithin15Minutes ? 'online' : 'offline';
    }
    return 'offline';
  };

  const filteredUsers = users
    .filter(user => 
      searchQuery.trim() === '' || 
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.telegram && user.telegram.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(user => {
      if (statusFilter === 'all') return true;
      return getUserStatus(user) === statusFilter;
    });

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Users</h1>
            <UserActions userRole={role} />
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <UserSearch 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => setStatusFilter(value as UserStatus | 'all')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="online">
                        <div className="flex items-center">
                          <Badge variant="success" className="mr-2">Online</Badge>
                          Online
                        </div>
                      </SelectItem>
                      <SelectItem value="offline">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">Offline</Badge>
                          Offline
                        </div>
                      </SelectItem>
                      <SelectItem value="new">
                        <div className="flex items-center">
                          <Badge variant="secondary" className="mr-2">New</Badge>
                          New Users
                        </div>
                      </SelectItem>
                      <SelectItem value="deleted">
                        <div className="flex items-center">
                          <Badge variant="destructive" className="mr-2">Deleted</Badge>
                          Deleted
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    {filteredUsers.length} users
                  </Badge>
                </div>
              </div>
              
              <UsersTable 
                users={filteredUsers}
                loading={loading}
                onRoleUpdate={handleUpdateRole}
                getUserStatus={getUserStatus}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
