
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkflowActions } from "./WorkflowActions";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Category } from "@/types/workflow";

interface WorkflowTableProps {
  workflows: any[];
  selectedWorkflows: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEditDetails?: (workflow: any) => void;
  onRun?: (workflow: any) => void;
  onDelete?: (ids: string[]) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  categories?: Category[]; // Add categories prop
}

export function WorkflowTable({
  workflows,
  selectedWorkflows,
  onSelect,
  onSelectAll,
  onEditDetails,
  onRun,
  onDelete,
  onToggleFavorite,
  categories = [], // Add default value
}: WorkflowTableProps) {
  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    if (onToggleFavorite) {
      onToggleFavorite(id, isFavorite);
    }
  };

  const areAllSelected = 
    workflows.length > 0 && selectedWorkflows.length === workflows.length;

  // Helper function to get category name from category ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox 
              checked={areAllSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
              className={selectedWorkflows.length > 0 && !areAllSelected ? "opacity-50" : ""}
            />
          </TableHead>
          <TableHead>Workflow</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workflows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
              No workflows found
            </TableCell>
          </TableRow>
        ) : (
          workflows.map((workflow) => (
            <TableRow key={workflow.id} className="group">
              <TableCell>
                <Checkbox
                  checked={selectedWorkflows.includes(workflow.id)}
                  onCheckedChange={() => onSelect(workflow.id)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {workflow.name}
                  {onToggleFavorite && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleFavorite(workflow.id, !workflow.is_favorite)}
                      className="h-6 w-6 p-0 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Star className={`h-4 w-4 ${workflow.is_favorite ? 'fill-yellow-500' : ''}`} />
                    </Button>
                  )}
                </div>
                {workflow.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{workflow.description}</p>
                )}
              </TableCell>
              <TableCell>
                {workflow.category && (
                  <Badge variant="secondary">
                    {getCategoryName(workflow.category)}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(workflow.created_at), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(workflow.updated_at), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {workflow.tags && workflow.tags.length > 0 ? (
                    workflow.tags.map((tag: string) => (
                      <Badge 
                        variant="outline" 
                        key={tag}
                        className="text-xs bg-background/50"
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">No tags</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {onRun && onEditDetails && onDelete && (
                  <WorkflowActions
                    workflow={workflow}
                    onEditWorkflow={onEditDetails}
                    onRunWorkflow={onRun}
                    onDeleteWorkflow={onDelete}
                  />
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
