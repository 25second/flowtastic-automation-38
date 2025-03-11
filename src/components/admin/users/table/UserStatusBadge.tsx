
import { Badge } from "@/components/ui/badge";
import { UserWithRole } from "@/types/user";
import { formatTimeAgo } from "../utils/dateUtils";

interface UserStatusBadgeProps {
  user: UserWithRole;
  getUserStatus: (user: UserWithRole) => 'online' | 'offline' | 'deleted' | 'new';
}

export function UserStatusBadge({ user, getUserStatus }: UserStatusBadgeProps) {
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
  }
}
