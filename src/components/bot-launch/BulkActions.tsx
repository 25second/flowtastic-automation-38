
import { Button } from "@/components/ui/button";
import { Play, StopCircle, Trash } from "lucide-react";

interface BulkActionsProps {
  onBulkStart: () => void;
  onBulkStop: () => void;
  onBulkDelete: () => void;
}

export function BulkActions({ onBulkStart, onBulkStop, onBulkDelete }: BulkActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={onBulkStart}>
        <Play className="mr-2 h-4 w-4" />
        Start Selected
      </Button>
      <Button variant="outline" onClick={onBulkStop}>
        <StopCircle className="mr-2 h-4 w-4" />
        Stop Selected
      </Button>
      <Button variant="destructive" onClick={onBulkDelete}>
        <Trash className="mr-2 h-4 w-4" />
        Delete Selected
      </Button>
    </div>
  );
}
