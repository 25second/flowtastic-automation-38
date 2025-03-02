
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { UserWithRole } from "@/types/user";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface UsersTableProps {
  users: UserWithRole[];
  loading: boolean;
  onRoleUpdate: (userId: string, newRole: 'admin' | 'client') => void;
}

export function UsersTable({ users, loading, onRoleUpdate }: UsersTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

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

  return (
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
        {users.map((user) => (
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
                    onClick={() => onRoleUpdate(user.id, 'admin')}
                  >
                    <Shield className="h-3.5 w-3.5 mr-1" />
                    Make Admin
                  </Button>
                )}
                {user.user_role?.role !== 'client' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onRoleUpdate(user.id, 'client')}
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
  );
}
