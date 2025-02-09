
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface WorkflowListHeaderProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
}

export const WorkflowListHeader = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeleteSelected
}: WorkflowListHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedCount === totalCount && totalCount > 0}
          onCheckedChange={onSelectAll}
        />
        <span className="text-sm text-gray-600">
          {selectedCount} selected
        </span>
      </div>
      {selectedCount > 0 && (
        <Button
          variant="destructive"
          onClick={onDeleteSelected}
        >
          Delete Selected
        </Button>
      )}
    </div>
  );
};
