
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkflowActions } from './WorkflowActions';
import { Badge } from "@/components/ui/badge";

interface WorkflowTableProps {
  workflows: any[] | undefined;
  selectedWorkflows: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEditDetails?: (workflow: any) => void;
  onRun?: (workflow: any) => void;
  onDelete?: (ids: string[]) => void;
}

export const WorkflowTable = ({
  workflows = [],
  selectedWorkflows,
  onSelect,
  onSelectAll,
  onEditDetails,
  onRun,
  onDelete
}: WorkflowTableProps) => {
  const areAllSelected = 
    workflows.length > 0 && selectedWorkflows.length === workflows.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox 
              checked={areAllSelected}
              // Using a class for visual indication of partial selection
              // instead of the non-existent indeterminate attribute
              onCheckedChange={onSelectAll}
              aria-label="Select all"
              className={selectedWorkflows.length > 0 && !areAllSelected ? "opacity-50" : ""}
            />
          </TableHead>
          <TableHead>Workflow Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workflows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
              No workflows found
            </TableCell>
          </TableRow>
        ) : (
          workflows.map((workflow) => {
            const isSelected = selectedWorkflows.includes(workflow.id);
            const status = workflow.status || 'idle';
            
            return (
              <TableRow key={workflow.id}>
                <TableCell>
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => onSelect(workflow.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{workflow.name || "Untitled Workflow"}</span>
                    {workflow.description && (
                      <span className="text-xs text-muted-foreground">{workflow.description}</span>
                    )}
                    {(workflow.tags && workflow.tags.length > 0) && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {workflow.tags.map((tag: string) => (
                          <Badge 
                            key={tag}
                            variant="outline"
                            className="bg-background/50 text-foreground text-xs py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    status === 'running' 
                      ? 'bg-orange-100 text-orange-700'
                      : status === 'completed'
                      ? 'bg-[#D3E4FD] text-blue-700' 
                      : status === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-[#F2FCE2] text-green-700'
                  }`}>
                    {status === 'running' && (
                      <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
                    )}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </TableCell>
                <TableCell>
                  {workflow.created_at ? format(new Date(workflow.created_at), "MMM dd, yyyy, h:mm a") : "-"}
                </TableCell>
                <TableCell>
                  {workflow.updated_at ? format(new Date(workflow.updated_at), "MMM dd, yyyy, h:mm a") : "-"}
                </TableCell>
                <TableCell>
                  <WorkflowActions
                    workflow={workflow}
                    onEditWorkflow={onEditDetails || (() => {})}
                    onRunWorkflow={onRun || (() => {})}
                    onDeleteWorkflow={onDelete || (() => {})}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
