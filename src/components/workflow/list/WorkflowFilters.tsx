
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface WorkflowFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const WorkflowFilters = ({
  searchQuery,
  onSearchChange,
}: WorkflowFiltersProps) => {
  return (
    <div className="relative w-[300px]">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        className="pl-8"
        placeholder="Поиск по названию, описанию или тегам..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
