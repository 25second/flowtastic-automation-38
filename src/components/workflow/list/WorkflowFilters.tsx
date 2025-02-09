
import { Input } from "@/components/ui/input";

interface WorkflowFiltersProps {
  nameFilter: string;
  descriptionFilter: string;
  tagFilter: string;
  onNameFilterChange: (value: string) => void;
  onDescriptionFilterChange: (value: string) => void;
  onTagFilterChange: (value: string) => void;
}

export const WorkflowFilters = ({
  nameFilter,
  descriptionFilter,
  tagFilter,
  onNameFilterChange,
  onDescriptionFilterChange,
  onTagFilterChange,
}: WorkflowFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Name</label>
        <Input
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <Input
          placeholder="Filter by description..."
          value={descriptionFilter}
          onChange={(e) => onDescriptionFilterChange(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Tags</label>
        <Input
          placeholder="Filter by tags..."
          value={tagFilter}
          onChange={(e) => onTagFilterChange(e.target.value)}
        />
      </div>
    </div>
  );
};
