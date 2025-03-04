
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { PlusIcon, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkflowCategories } from './list/WorkflowCategories';
import { WorkflowActions } from './list/WorkflowActions';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from 'sonner';
import { Category } from '@/types/workflow';
import { Badge } from '@/components/ui/badge';

interface WorkflowListProps {
  isLoading: boolean;
  workflows: any[] | undefined;
  onDelete?: (ids: string[]) => void;
  onEditDetails?: (workflow: any) => void;
  onRun?: (workflow: any) => void;
  categories: Category[];
  categoriesLoading?: boolean;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onAddCategory?: (category: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onEditCategory?: (category: Category) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onAddWorkflow?: () => void;
}

export const WorkflowList = ({ 
  isLoading, 
  workflows, 
  onDelete, 
  onEditDetails,
  onRun,
  categories,
  categoriesLoading = false,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  onDeleteCategory,
  onEditCategory,
  searchQuery = '',
  onSearchChange,
  onAddWorkflow
}: WorkflowListProps) => {
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  const filteredWorkflows = workflows?.filter(workflow => {
    if (!workflow) return false;

    const searchLower = searchQuery.toLowerCase();
    const name = workflow.name?.toLowerCase() || '';
    const description = workflow.description?.toLowerCase() || '';
    const tags = workflow.tags || [];

    const matchesSearch = 
      name.includes(searchLower) || 
      description.includes(searchLower) || 
      tags.some((tag: string) => tag.toLowerCase().includes(searchLower));
    
    const categoryMatch = !selectedCategory || workflow.category === selectedCategory;

    return matchesSearch && categoryMatch;
  });

  const handleSelectAll = () => {
    if (selectedWorkflows.length === filteredWorkflows?.length) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(filteredWorkflows?.map(w => w.id) || []);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(id) 
        ? prev.filter(wId => wId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedWorkflows.length === 0) {
      toast.error("Please select workflows to delete");
      return;
    }
    onDelete?.(selectedWorkflows);
    setSelectedWorkflows([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  const areAllSelected = 
    filteredWorkflows?.length > 0 && selectedWorkflows.length === filteredWorkflows.length;

  if (isLoading) {
    return <p className="text-muted-foreground">Loading workflows...</p>;
  }

  return (
    <div className="w-full space-y-4">
      <WorkflowCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onCategorySelect}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
        onEditCategory={onEditCategory}
        isLoading={categoriesLoading}
      />

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search workflows by name, status, or dates..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button onClick={onAddWorkflow}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Workflow
        </Button>
      </div>

      {selectedWorkflows.length > 0 && (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              // Handle bulk start
              toast.success(`${selectedWorkflows.length} workflows started`);
            }}
          >
            Start Selected
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              // Handle bulk stop
              toast.success(`${selectedWorkflows.length} workflows stopped`);
            }}
          >
            Stop Selected
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={areAllSelected}
                // Используем класс для визуального обозначения частичного выбора
                // вместо несуществующего атрибута indeterminate
                onCheckedChange={handleSelectAll}
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
          {filteredWorkflows?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                No workflows found
              </TableCell>
            </TableRow>
          ) : (
            filteredWorkflows?.map((workflow) => {
              const isSelected = selectedWorkflows.includes(workflow.id);
              const status = workflow.status || 'idle';
              
              return (
                <TableRow key={workflow.id}>
                  <TableCell>
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => handleSelect(workflow.id)}
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
    </div>
  );
}
