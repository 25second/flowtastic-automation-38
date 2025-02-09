
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Pencil, Edit } from 'lucide-react';

interface WorkflowListProps {
  isLoading: boolean;
  workflows: any[] | undefined;
  onDelete: (ids: string[]) => void;
  onEditDetails: (workflow: any) => void;
  onEditCanvas: (workflow: any) => void;
  onRun: (workflow: any) => void;
}

export const WorkflowList = ({ 
  isLoading, 
  workflows, 
  onDelete, 
  onEditDetails,
  onEditCanvas, 
  onRun 
}: WorkflowListProps) => {
  const [nameFilter, setNameFilter] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  const filteredWorkflows = workflows?.filter(workflow => {
    if (!workflow) return false;

    const name = workflow.name?.toLowerCase() || '';
    const description = workflow.description?.toLowerCase() || '';
    const tags = workflow.tags || [];

    const nameMatch = name.includes(nameFilter.toLowerCase());
    const descriptionMatch = !descriptionFilter || description.includes(descriptionFilter.toLowerCase());
    const tagMatch = !tagFilter || tags.some((tag: string) => 
      tag.toLowerCase().includes(tagFilter.toLowerCase())
    );

    return nameMatch && descriptionMatch && tagMatch;
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
    onDelete(selectedWorkflows);
    setSelectedWorkflows([]);
  };

  if (isLoading) {
    return <p>Loading workflows...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Name</label>
          <Input
            placeholder="Filter by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <Input
            placeholder="Filter by description..."
            value={descriptionFilter}
            onChange={(e) => setDescriptionFilter(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Tags</label>
          <Input
            placeholder="Filter by tags..."
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedWorkflows.length === filteredWorkflows?.length && filteredWorkflows.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-gray-600">
            {selectedWorkflows.length} selected
          </span>
        </div>
        {selectedWorkflows.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {filteredWorkflows?.map((workflow) => (
          <div
            key={workflow.id}
            className="p-4 border rounded-lg flex items-center justify-between bg-white shadow-sm"
          >
            <div className="flex items-center gap-4 flex-1">
              <Checkbox
                checked={selectedWorkflows.includes(workflow.id)}
                onCheckedChange={() => handleSelect(workflow.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{workflow.name}</h3>
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
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                )}
                {workflow.tags && workflow.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {workflow.tags.map((tag: string) => (
                      <Badge 
                        key={tag}
                        variant="secondary"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditCanvas(workflow)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Canvas
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
        ))}
      </div>

      {(!filteredWorkflows || filteredWorkflows.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          {workflows && workflows.length > 0 
            ? 'No workflows found matching your filters'
            : 'No workflows found'}
        </div>
      )}
    </div>
  );
};

