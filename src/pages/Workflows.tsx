
import { useState, useEffect } from 'react';
import { WorkflowListView } from '@/components/workflow/list/WorkflowListView';
import { WorkflowEditorView } from '@/components/workflow/editor/WorkflowEditorView';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { FlowNodeWithData } from '@/types/flow';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAccentColor } from '@/hooks/useAccentColor';
import { useCategoryManagement } from '@/hooks/workflow/useCategoryManagement';
import { useWorkflowFavorites } from '@/hooks/workflow/useWorkflowFavorites';

const WorkflowsPage = () => {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useAccentColor();

  const { session } = useAuth();
  const { handleToggleFavorite } = useWorkflowFavorites();

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
    await Promise.all(ids.map(id => deleteWorkflow.mutateAsync(id)));
    return;
  };

  const handleSaveWorkflowDetails = async (updatedWorkflow: any) => {
    await saveWorkflow.mutateAsync({
      id: updatedWorkflow.id,
      nodes: selectedWorkflow.nodes || [],
      edges: selectedWorkflow.edges || [],
      workflowName: updatedWorkflow.name,
      workflowDescription: updatedWorkflow.description || '',
      category: categories?.find(cat => cat.id === updatedWorkflow.category) || null,
      tags: updatedWorkflow.tags || []
    });
    return;
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
            {!isCreateMode ? (
              <WorkflowListView 
                isLoading={isLoading}
                workflows={workflows}
                onAddWorkflow={handleAddWorkflow}
                onEditWorkflow={handleSaveWorkflowDetails}
                onDeleteWorkflow={handleWorkflowDelete}
                onToggleFavorite={handleToggleFavorite}
                categories={categories}
                categoriesLoading={categoriesLoading}
                handleAddCategory={handleAddCategory}
                handleCategoryDelete={handleCategoryDelete}
                handleCategoryEdit={handleCategoryEdit}
                category={category}
                handleCategorySelect={handleCategorySelect}
              />
            ) : (
              <WorkflowEditorView
                selectedWorkflow={selectedWorkflow}
                initialNodes={initialNodes}
                initialEdges={initialEdges}
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
