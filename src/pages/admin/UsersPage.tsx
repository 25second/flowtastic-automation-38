
import { useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { SearchIcon, UserPlus, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUserRole } from '@/hooks/useUserRole';

interface UserWithRole {
  id: string;
  username: string;
  telegram: string | null;
  created_at: string;
  user_role: {
    role: 'admin' | 'client';
  } | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { role } = useUserRole();

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            user_role:user_roles(role)
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setUsers(data as UserWithRole[] || []);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

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
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                Your Role: {role || 'Loading...'}
              </Badge>
              <Button variant="default">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {loading ? (
                <p>Loading users...</p>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Telegram</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                        <TableCell>{user.username || 'N/A'}</TableCell>
                        <TableCell>{user.telegram || 'N/A'}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.user_role?.role === 'admin' ? 'default' : 'outline'}
                            className={user.user_role?.role === 'admin' ? 'bg-primary' : ''}
                          >
                            {user.user_role?.role || 'client'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {user.user_role?.role !== 'admin' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleUpdateRole(user.id, 'admin')}
                              >
                                <Shield className="h-3.5 w-3.5 mr-1" />
                                Make Admin
                              </Button>
                            )}
                            {user.user_role?.role !== 'client' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleUpdateRole(user.id, 'client')}
                              >
                                Make Client
                              </Button>
                            )}
                            <Button variant="outline" size="sm">Details</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
