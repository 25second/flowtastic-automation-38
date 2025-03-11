
import { Button } from "@/components/ui/button";
import { Shield, XCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";

interface UserBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onUpdateRole: (role: 'admin' | 'client') => void;
}

export function UserBulkActions({ 
  selectedCount, 
  onClearSelection,
  onUpdateRole
}: UserBulkActionsProps) {
  return (
    <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium">{selectedCount} users selected</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearSelection}
          className="h-8 px-2"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Clear selection
        </Button>
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-1" />
              Change role
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdateRole('admin')}>
              Make Admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateRole('client')}>
              Make Client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
