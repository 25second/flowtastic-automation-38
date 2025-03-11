
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from '@/hooks/useUserRole';
import { useUsers } from '@/hooks/admin/useUsers';
import { UserActions } from '@/components/admin/users/UserActions';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { UserBulkActions } from '@/components/admin/users/UserBulkActions';
import { UserFilters } from '@/components/admin/users/UserFilters';
import { filterUsers, getUserStatus } from '@/utils/userStatus';

export default function UsersPage() {
  const { role } = useUserRole();
  const {
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
  } = useUsers();

  const filteredUsers = filterUsers(users, searchQuery, statusFilter);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Create a handler for the status filter that accepts string and handles the type conversion
  const handleStatusChange = (value: string) => {
    // Type assertion to ensure the value is of the correct type
    setStatusFilter(value as "all" | "online" | "offline" | "deleted" | "new");
  };

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
              <UserFilters 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={handleStatusChange}
                totalUsers={filteredUsers.length}
              />
              
              {selectedUsers.length > 0 && (
                <div className="mb-4">
                  <UserBulkActions 
                    selectedCount={selectedUsers.length}
                    onClearSelection={() => setSelectedUsers([])}
                    onUpdateRole={handleBulkUpdateRole}
                  />
                </div>
              )}
              
              <UsersTable 
                users={filteredUsers}
                loading={loading}
                onRoleUpdate={handleUpdateRole}
                getUserStatus={getUserStatus}
                selectedUsers={selectedUsers}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
