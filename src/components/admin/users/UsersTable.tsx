
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserWithRole, UserStatus } from "@/types/user";
import { Checkbox } from "@/components/ui/checkbox";
import { UserStatusBadge } from "./table/UserStatusBadge";
import { UserRoleBadge } from "./table/UserRoleBadge";
import { UserTableActions } from "./table/UserTableActions";
import { formatDate } from "./utils/dateUtils";

interface UsersTableProps {
  users: UserWithRole[];
  loading: boolean;
  onRoleUpdate: (userId: string, newRole: 'admin' | 'client') => void;
  getUserStatus: (user: UserWithRole) => UserStatus;
  selectedUsers?: string[];
  onSelectUser?: (userId: string) => void;
  onSelectAll?: () => void;
}

export function UsersTable({ 
  users, 
  loading, 
  onRoleUpdate, 
  getUserStatus,
  selectedUsers = [],
  onSelectUser,
  onSelectAll
}: UsersTableProps) {
  if (loading) {
    return <p>Loading users...</p>;
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {onSelectUser && onSelectAll && (
            <TableHead className="w-12">
              <Checkbox 
                checked={isAllSelected} 
                onCheckedChange={onSelectAll}
                aria-label="Select all users"
              />
            </TableHead>
          )}
          <TableHead>User ID</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Telegram</TableHead>
          <TableHead>Registration Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            {onSelectUser && (
              <TableCell>
                <Checkbox 
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onSelectUser(user.id)}
                  aria-label={`Select user ${user.username || user.id}`}
                />
              </TableCell>
            )}
            <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
            <TableCell>{user.username || 'N/A'}</TableCell>
            <TableCell>{user.telegram || 'N/A'}</TableCell>
            <TableCell>{formatDate(user.created_at)}</TableCell>
            <TableCell>
              <UserStatusBadge user={user} getUserStatus={getUserStatus} />
            </TableCell>
            <TableCell>
              <UserRoleBadge userRole={user.user_role} />
            </TableCell>
            <TableCell>
              <UserTableActions 
                userRole={user.user_role}
                onRoleUpdate={(newRole) => onRoleUpdate(user.id, newRole)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
