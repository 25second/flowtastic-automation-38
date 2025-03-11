
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface UserTableActionsProps {
  userRole?: { role?: 'admin' | 'client' };
  onRoleUpdate: (newRole: 'admin' | 'client') => void;
}

export function UserTableActions({ userRole, onRoleUpdate }: UserTableActionsProps) {
  return (
    <div className="flex space-x-2">
      {userRole?.role !== 'admin' && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onRoleUpdate('admin')}
        >
          <Shield className="h-3.5 w-3.5 mr-1" />
          Make Admin
        </Button>
      )}
      {userRole?.role !== 'client' && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onRoleUpdate('client')}
        >
          Make Client
        </Button>
      )}
      <Button variant="outline" size="sm">Details</Button>
    </div>
  );
}
