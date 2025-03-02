
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AdminMenuItemProps {
  isActive: boolean;
}

export function AdminMenuItem({ isActive }: AdminMenuItemProps) {
  return (
    <Link
      to="/app/admin"
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
        isActive 
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Users className="h-4 w-4" />
      <span>Admin Panel</span>
    </Link>
  );
}
