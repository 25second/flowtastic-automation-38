
import { useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';
import { UserWithRole } from '@/types/user';
import { UserSearch } from '@/components/admin/users/UserSearch';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { UserActions } from '@/components/admin/users/UserActions';

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { role } = useUserRole();

  useEffect(() => {
    fetchUsers();
  }, []);
  
  async function fetchUsers() {
    try {
      setLoading(true);
      
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
        return {
          ...profile,
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

  const filteredUsers = searchQuery.trim() === '' 
    ? users 
    : users.filter(user => 
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.telegram && user.telegram.toLowerCase().includes(searchQuery.toLowerCase()))
      );

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
              <div className="flex items-center mb-4">
                <UserSearch 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>
              
              <UsersTable 
                users={filteredUsers}
                loading={loading}
                onRoleUpdate={handleUpdateRole}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
