
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search } from "lucide-react";

interface TableSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddTable?: () => void;
}

export const TableSearchBar = ({
  searchQuery,
  onSearchChange,
  onAddTable
}: TableSearchBarProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tables by name, columns, or dates..."
          className="pl-9"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <Button onClick={onAddTable}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Table
      </Button>
    </div>
  );
};
