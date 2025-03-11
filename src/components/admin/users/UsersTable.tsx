
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { UserWithRole, UserStatus } from "@/types/user";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface UsersTableProps {
  users: UserWithRole[];
  loading: boolean;
  onRoleUpdate: (userId: string, newRole: 'admin' | 'client') => void;
  getUserStatus: (user: UserWithRole) => UserStatus;
}

export function UsersTable({ users, loading, onRoleUpdate, getUserStatus }: UsersTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const getOnlineTime = (lastActiveStr: string) => {
    const lastActive = new Date(lastActiveStr);
    const now = new Date();
    const diffMs = now.getTime() - lastActive.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  const renderStatusBadge = (user: UserWithRole) => {
    const status = getUserStatus(user);
    
    switch(status) {
      case 'online':
        return (
          <div>
            <Badge variant="success">Online</Badge>
            <span className="block text-xs text-muted-foreground mt-1">
              For {user.last_active ? getOnlineTime(user.last_active) : 'unknown time'}
            </span>
          </div>
        );
      case 'offline':
        return (
          <div>
            <Badge variant="outline">Offline</Badge>
            {user.last_active && (
              <span className="block text-xs text-muted-foreground mt-1">
                Last seen {formatTimeAgo(user.last_active)}
              </span>
            )}
          </div>
        );
      case 'deleted':
        return (
          <div>
            <Badge variant="destructive">Deleted</Badge>
            {user.deleted_at && (
              <span className="block text-xs text-muted-foreground mt-1">
                {formatDate(user.deleted_at)}
              </span>
            )}
          </div>
        );
      case 'new':
        return (
          <div>
            <Badge variant="secondary">New</Badge>
            <span className="block text-xs text-muted-foreground mt-1">
              Joined {formatTimeAgo(user.created_at)}
            </span>
          </div>
        );
      default:
        return null;
    }
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
          <TableHead>Status</TableHead>
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
            <TableCell>{renderStatusBadge(user)}</TableCell>
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
