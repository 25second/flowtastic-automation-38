
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search } from "lucide-react";

interface WorkflowSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddWorkflow?: () => void;
}

export const WorkflowSearchBar = ({
  searchQuery,
  onSearchChange,
  onAddWorkflow
}: WorkflowSearchBarProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search workflows by name, status, or dates..."
          className="pl-9"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <Button onClick={onAddWorkflow}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Workflow
      </Button>
    </div>
  );
};
