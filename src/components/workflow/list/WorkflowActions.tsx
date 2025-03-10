import { Button } from "@/components/ui/button";
import { Play, StopCircle, Trash, Edit, Star, Pencil } from "lucide-react";
import { useNavigate } from 'react-router-dom';
interface WorkflowActionsProps {
  workflow: any;
  onEditWorkflow: (workflow: any) => void;
  onRunWorkflow: (workflow: any) => void;
  onDeleteWorkflow: (ids: string[]) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}
export function WorkflowActions({
  workflow,
  onEditWorkflow,
  onRunWorkflow,
  onDeleteWorkflow,
  onToggleFavorite
}: WorkflowActionsProps) {
  const isRunning = workflow.status === "running";
  const navigate = useNavigate();
  const handleEdit = () => {
    // First try the edit workflow details function (modal)
    onEditWorkflow(workflow);
  };
  const handleEditCanvas = () => {
    // Navigate to canvas with the workflow data
    navigate('/canvas', {
      state: {
        workflow
      }
    });
  };
  return <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="icon" onClick={() => isRunning ? null : onRunWorkflow(workflow)}>
        {isRunning ? <StopCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      
      
      <Button variant="ghost" size="icon" onClick={handleEditCanvas} title="Edit Workflow Canvas">
        <Edit className="h-4 w-4" />
      </Button>
      
      {onToggleFavorite && <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(workflow.id, !workflow.is_favorite)} title={workflow.is_favorite ? "Remove from favorites" : "Add to favorites"}>
          <Star className={`h-4 w-4 ${workflow.is_favorite ? 'fill-yellow-500' : ''}`} />
        </Button>}
      
      <Button variant="ghost" size="icon" onClick={() => onDeleteWorkflow([workflow.id])}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>;
}