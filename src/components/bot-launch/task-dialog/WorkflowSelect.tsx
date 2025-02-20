
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkflowSelectProps {
  selectedWorkflow: string | null;
  onWorkflowChange: (value: string) => void;
  userWorkflows: any[];
  isLoadingWorkflows: boolean;
}

export function WorkflowSelect({ 
  selectedWorkflow, 
  onWorkflowChange, 
  userWorkflows, 
  isLoadingWorkflows 
}: WorkflowSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Select Workflow</Label>
      <Select value={selectedWorkflow || ''} onValueChange={onWorkflowChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a workflow" />
        </SelectTrigger>
        <SelectContent>
          {isLoadingWorkflows ? (
            <SelectItem value="loading" disabled>
              Loading workflows...
            </SelectItem>
          ) : userWorkflows.length > 0 ? (
            userWorkflows.map((workflow) => (
              <SelectItem key={workflow.id} value={workflow.id}>
                {workflow.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-workflows" disabled>
              No workflows found
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
