
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface BulkActionsProps {
  selectedCount: number;
  onBulkStart?: () => void;
  onBulkStop?: () => void;
  onBulkDelete: () => void;
}

export const BulkActions = ({
  selectedCount,
  onBulkStart,
  onBulkStop,
  onBulkDelete
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  const handleBulkStart = () => {
    if (onBulkStart) {
      onBulkStart();
    } else {
      toast.success(`${selectedCount} workflows started`);
    }
  };

  const handleBulkStop = () => {
    if (onBulkStop) {
      onBulkStop();
    } else {
      toast.success(`${selectedCount} workflows stopped`);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleBulkStart}
      >
        Start Selected
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleBulkStop}
      >
        Stop Selected
      </Button>
      <Button 
        size="sm" 
        variant="destructive"
        onClick={onBulkDelete}
      >
        Delete Selected
      </Button>
    </div>
  );
};
