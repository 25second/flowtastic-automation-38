
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WorkflowListProps {
  isLoading: boolean;
  workflows: any[] | undefined;
  onDelete: (id: string) => void;
}

export const WorkflowList = ({ isLoading, workflows, onDelete }: WorkflowListProps) => {
  if (isLoading) {
    return <p>Loading workflows...</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {workflows?.map((workflow) => (
        <div
          key={workflow.id}
          className="p-3 border rounded flex justify-between items-center"
        >
          <div>
            <h3 className="font-medium">{workflow.name}</h3>
            {workflow.description && (
              <p className="text-sm text-gray-600">{workflow.description}</p>
            )}
          </div>
          <button
            onClick={() => onDelete(workflow.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
