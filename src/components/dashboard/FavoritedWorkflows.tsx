
import { useState, useEffect } from 'react';
import { WorkflowItem } from '@/components/workflow/list/WorkflowItem';
import { useNavigate } from 'react-router-dom';
import { useFavoritedWorkflows } from '@/hooks/workflow/useFavoritedWorkflows';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus, MenuSquare, Bot, Users, GitBranch } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function FavoritedWorkflows() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'workflows' | 'agents'>('workflows');
  
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
  
  const renderContent = () => {
    if (viewMode === 'workflows') {
      if (favoritedWorkflows && favoritedWorkflows.length > 0) {
        return (
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
        );
      } else {
        return (
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
        );
      }
    } else {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>У вас пока нет избранных агентов</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/agents')}
          >
            Перейти к агентам
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Избранное</h2>
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as 'workflows' | 'agents')}
            className="ml-4"
          >
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="workflows" className="flex items-center gap-1">
                <GitBranch className="h-4 w-4" />
                <span>Воркфлоу</span>
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-1">
                <Bot className="h-4 w-4" />
                <span>Агенты</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={handleCreateWorkflow}
        >
          <Plus className="h-4 w-4" />
          {viewMode === 'workflows' ? 'Создать новый' : 'Создать агент'}
        </Button>
      </div>
      
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
}
