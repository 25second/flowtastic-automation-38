
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/hooks/useUserRole';

interface AdminDashboardHeaderProps {
  role?: UserRole | null;
}

export function AdminDashboardHeader({ role }: AdminDashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Badge variant="outline" className="px-3 py-1">
        Role: {role || 'Loading...'}
      </Badge>
    </div>
  );
}
