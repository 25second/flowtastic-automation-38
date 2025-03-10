import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { WorkflowEditor } from '@/components/workflow/WorkflowEditor';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { FlowNodeWithData } from '@/types/flow';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAccentColor } from '@/hooks/useAccentColor';
import { useCategoryManagement } from '@/hooks/workflow/useCategoryManagement';
import { WorkflowPageHeader } from '@/components/workflow/WorkflowPageHeader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EditWorkflowDialog } from '@/components/workflow/list/EditWorkflowDialog';

const WorkflowsPage = () => {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  useAccentColor();

  const { session } = useAuth();

  const initialNodes: FlowNodeWithData[] = [{ 
    id: '1', 
    type: 'start-script', 
    position: { x: 50, y: 50 }, 
    data: { type: 'start-script', label: 'Start Script' } 
  }];
  const initialEdges = [];

  const {
    workflows,
    isLoading,
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    category,
    setCategory,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow,
    deleteWorkflow,
    refreshWorkflows,
  } = useWorkflowManager(initialNodes, initialEdges);

  const {
    categories,
    categoriesLoading,
    handleAddCategory,
    handleCategoryDelete,
    handleCategoryEdit
  } = useCategoryManagement(session);

  const toggleFavorite = useMutation({
    mutationFn: async ({ workflowId, isFavorite }: { workflowId: string, isFavorite: boolean }) => {
      const { data, error } = await supabase
        .from('workflows')
        .update({ is_favorite: isFavorite })
        .eq('id', workflowId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['favorited-workflows'] });
      toast.success('Favorite status updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update favorite status');
      console.error('Error updating favorite:', error);
    }
  });

  useEffect(() => {
    if (location.state?.workflow) {
      const workflowId = location.state.workflow.id;
      const workflow = workflows?.find(w => w.id === workflowId);
      setSelectedWorkflow(workflow);
      setIsCreateMode(true);
    }
  }, [location.state, workflows]);

  const handleAddWorkflow = () => setIsCreateMode(true);
  
  const handleCategorySelect = (categoryId: string | null) => {
    setCategory(categories?.find(cat => cat.id === categoryId) || null);
  };

  const handleWorkflowDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => deleteWorkflow.mutateAsync(id)));
      toast.success('Workflows deleted successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleWorkflowEditDetails = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setShowEditDialog(true);
  };

  const handleSaveWorkflowDetails = async (updatedWorkflow: any) => {
    try {
      await saveWorkflow.mutateAsync({
        id: updatedWorkflow.id,
        nodes: selectedWorkflow.nodes || [],
        edges: selectedWorkflow.edges || [],
        workflowName: updatedWorkflow.name,
        workflowDescription: updatedWorkflow.description || '',
        category: categories?.find(cat => cat.id === updatedWorkflow.category) || null,
        tags: updatedWorkflow.tags || []
      });
      setShowEditDialog(false);
      setSelectedWorkflow(null);
    } catch (error) {
      toast.error('Failed to update workflow');
    }
  };

  const handleWorkflowRun = (workflow: any) => {
    toast.success(`Workflow "${workflow.name}" run`);
  };

  const handleToggleFavorite = (workflowId: string, isFavorite: boolean) => {
    toggleFavorite.mutate({ workflowId, isFavorite });
  };

  const handleEditorCancel = () => {
    setIsCreateMode(false);
    setSelectedWorkflow(null);
    setWorkflowName('');
    setWorkflowDescription('');
    setTags([]);
    setCategory(null);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar onNewWorkflow={handleAddWorkflow} />
        <div className="flex-1">
          <div className="container mx-auto py-8 space-y-6">
            {!isCreateMode && <WorkflowPageHeader onAddWorkflow={handleAddWorkflow} />}

            {!isCreateMode ? (
              <>
                <WorkflowList
                  isLoading={isLoading}
                  workflows={workflows}
                  onDelete={handleWorkflowDelete}
                  onEditDetails={handleWorkflowEditDetails}
                  onRun={handleWorkflowRun}
                  onToggleFavorite={handleToggleFavorite}
                  categories={categories || []}
                  categoriesLoading={categoriesLoading}
                  selectedCategory={category?.id || null}
                  onCategorySelect={handleCategorySelect}
                  onAddCategory={handleAddCategory}
                  onDeleteCategory={handleCategoryDelete}
                  onEditCategory={handleCategoryEdit}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onAddWorkflow={handleAddWorkflow}
                />
                
                {selectedWorkflow && (
                  <EditWorkflowDialog
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                    workflow={selectedWorkflow}
                    onSave={handleSaveWorkflowDetails}
                    categories={categories || []}
                  />
                )}
              </>
            ) : (
              <WorkflowEditor
                selectedWorkflow={selectedWorkflow}
                initialNodes={selectedWorkflow?.nodes || initialNodes}
                initialEdges={selectedWorkflow?.edges || initialEdges}
                workflowName={workflowName}
                setWorkflowName={setWorkflowName}
                workflowDescription={workflowDescription}
                setWorkflowDescription={setWorkflowDescription}
                tags={tags}
                setTags={setTags}
                category={category}
                setCategory={setCategory}
                showSaveDialog={showSaveDialog}
                setShowSaveDialog={setShowSaveDialog}
                saveWorkflow={saveWorkflow}
                refreshWorkflows={refreshWorkflows}
                onCancel={handleEditorCancel}
              />
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WorkflowsPage;
