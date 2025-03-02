
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface UserActionsProps {
  userRole: string | null;
}

export function UserActions({ userRole }: UserActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <Badge variant="outline" className="px-3 py-1">
        Your Role: {userRole || 'Loading...'}
      </Badge>
      <Button variant="default">
        <UserPlus className="mr-2 h-4 w-4" />
        Add User
      </Button>
    </div>
  );
}
