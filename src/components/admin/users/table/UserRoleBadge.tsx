
import { Badge } from "@/components/ui/badge";
import { UserWithRole } from "@/types/user";

interface UserRoleBadgeProps {
  userRole: UserWithRole['user_role'];
}

export function UserRoleBadge({ userRole }: UserRoleBadgeProps) {
  return (
    <Badge 
      variant={userRole?.role === 'admin' ? 'default' : 'outline'}
      className={userRole?.role === 'admin' ? 'bg-primary' : ''}
    >
      {userRole?.role || 'client'}
    </Badge>
  );
}
