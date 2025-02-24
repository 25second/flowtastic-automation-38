
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Pencil, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkflowItemProps {
  workflow: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEditDetails: (workflow: any) => void;
  onDelete: (ids: string[]) => void;
  onRun: (workflow: any) => void;
}

export const WorkflowItem = ({
  workflow,
  isSelected,
  onSelect,
  onEditDetails,
  onDelete,
  onRun
}: WorkflowItemProps) => {
  const navigate = useNavigate();

  const handleEditCanvas = () => {
    console.log('Navigating to canvas with workflow:', workflow);
    navigate('/canvas', { state: { workflow } });
  };

  return (
    <div className="p-4 border rounded-lg flex items-center justify-between bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4 flex-1">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(workflow.id)}
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{workflow.name || "Untitled Workflow"}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditDetails(workflow)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          {workflow.description && (
            <p className="text-sm text-muted-foreground">{workflow.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {workflow.category && (
              <Badge variant="secondary">
                {workflow.category}
              </Badge>
            )}
            {workflow.tags && workflow.tags.length > 0 && workflow.tags.map((tag: string) => (
              <Badge 
                key={tag}
                variant="outline"
                className="bg-background/50 text-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditCanvas}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRun(workflow)}
        >
          Run
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete([workflow.id])}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
