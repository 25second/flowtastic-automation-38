
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface UserSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function UserSearch({ searchQuery, onSearchChange }: UserSearchProps) {
  return (
    <div className="relative flex-1">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search users..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
