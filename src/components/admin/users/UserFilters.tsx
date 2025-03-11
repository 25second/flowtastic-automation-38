
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserSearch } from './UserSearch';
import { UserStatus } from '@/types/user';

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  totalUsers: number;
}

export function UserFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalUsers
}: UserFiltersProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <UserSearch 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <Select 
          value={statusFilter} 
          onValueChange={(value) => onStatusChange(value as UserStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="online">
              <div className="flex items-center">
                <Badge variant="success" className="mr-2">Online</Badge>
                Online
              </div>
            </SelectItem>
            <SelectItem value="offline">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">Offline</Badge>
                Offline
              </div>
            </SelectItem>
            <SelectItem value="new">
              <div className="flex items-center">
                <Badge variant="secondary" className="mr-2">New</Badge>
                New Users
              </div>
            </SelectItem>
            <SelectItem value="deleted">
              <div className="flex items-center">
                <Badge variant="destructive" className="mr-2">Deleted</Badge>
                Deleted
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Badge variant="outline" className="px-3 py-1">
          {totalUsers} users
        </Badge>
      </div>
    </div>
  );
}
