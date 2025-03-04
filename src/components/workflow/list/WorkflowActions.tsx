
import { Button } from "@/components/ui/button";
import { Play, StopCircle, Trash, Edit } from "lucide-react";

interface WorkflowActionsProps {
  workflow: any;
  onEditWorkflow: (workflow: any) => void;
  onRunWorkflow: (workflow: any) => void;
  onDeleteWorkflow: (ids: string[]) => void;
}

export function WorkflowActions({
  workflow,
  onEditWorkflow,
  onRunWorkflow,
  onDeleteWorkflow
}: WorkflowActionsProps) {
  const isRunning = workflow.status === "running";

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => isRunning ? null : onRunWorkflow(workflow)}
      >
        {isRunning ? <StopCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEditWorkflow(workflow)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteWorkflow([workflow.id])}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
