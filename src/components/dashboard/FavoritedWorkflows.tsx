
import { useState } from 'react';
import { WorkflowItem } from '@/components/workflow/list/WorkflowItem';
import { useNavigate } from 'react-router-dom';
import { useFavoritedWorkflows } from '@/hooks/workflow/useFavoritedWorkflows';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function FavoritedWorkflows() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  
  const { 
    favoritedWorkflows, 
    isLoading,
    toggleFavorite 
  } = useFavoritedWorkflows(session);

  const handleWorkflowDelete = async (ids: string[]) => {
    toast('Delete functionality would go here');
  };

  const handleWorkflowEditDetails = (workflow: any) => {
    navigate('/workflows', { state: { workflow } });
  };

  const handleWorkflowRun = (workflow: any) => {
    toast.success(`Workflow "${workflow.name}" run`);
  };

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    toggleFavorite.mutate({ workflowId: id, isFavorite });
  };

  const handleSelect = (id: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(id) 
        ? prev.filter(wId => wId !== id)
        : [...prev, id]
    );
  };

  const handleCreateWorkflow = () => {
    navigate('/workflows');
  };

  if (isLoading) {
    return <div className="rounded-xl border bg-card p-8 animate-pulse">Loading favorite workflows...</div>;
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">Избранные воркфлоу</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={handleCreateWorkflow}
        >
          <Plus className="h-4 w-4" />
          Создать новый
        </Button>
      </div>
      
      <div className="p-6">
        {favoritedWorkflows && favoritedWorkflows.length > 0 ? (
          <div className="grid gap-4">
            {favoritedWorkflows.map((workflow) => (
              <WorkflowItem
                key={workflow.id}
                workflow={workflow}
                isSelected={selectedWorkflows.includes(workflow.id)}
                onSelect={handleSelect}
                onEditDetails={handleWorkflowEditDetails}
                onDelete={handleWorkflowDelete}
                onRun={handleWorkflowRun}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>У вас пока нет избранных воркфлоу</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleCreateWorkflow}
            >
              Перейти к списку воркфлоу
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
