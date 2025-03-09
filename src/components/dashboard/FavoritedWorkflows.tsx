
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritedWorkflows } from '@/hooks/workflow/useFavoritedWorkflows';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus, MenuSquare, Bot, Users, GitBranch, Star, Edit, Play } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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

  const handleEditCanvas = (workflow: any) => {
    navigate('/canvas', { state: { workflow } });
  };

  if (isLoading) {
    return <div className="rounded-xl border bg-card p-8 animate-pulse">Loading favorite workflows...</div>;
  }
  
  const renderContent = () => {
    if (viewMode === 'workflows') {
      if (favoritedWorkflows && favoritedWorkflows.length > 0) {
        return (
          <div className="space-y-2">
            {favoritedWorkflows.map((workflow) => (
              <div 
                key={workflow.id} 
                className="flex items-center justify-between py-2 px-4 rounded-lg border border-border/50 hover:bg-accent/20 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{workflow.name || "Untitled Workflow"}</h4>
                  </div>
                  {workflow.category && (
                    <Badge variant="outline" className="bg-background/50 text-xs px-2">
                      {workflow.category}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCanvas(workflow)}
                    className="h-8 w-8"
                    title="Edit Workflow"
                  >
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleWorkflowRun(workflow)}
                    className="h-8 w-8"
                    title="Run Workflow"
                  >
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(workflow.id, false)}
                    className="h-8 w-8"
                    title="Remove from Favorites"
                  >
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div className="text-center py-6 text-muted-foreground">
            <p>У вас пока нет избранных воркфлоу</p>
            <Button 
              variant="outline" 
              className="mt-3"
              onClick={handleCreateWorkflow}
            >
              Перейти к списку воркфлоу
            </Button>
          </div>
        );
      }
    } else {
      return (
        <div className="text-center py-6 text-muted-foreground">
          <p>У вас пока нет избранных агентов</p>
          <Button 
            variant="outline" 
            className="mt-3"
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
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium">Избранное</h2>
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
      
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
}
