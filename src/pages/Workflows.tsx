
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

const WorkflowsPage = () => {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Apply accent color
  useAccentColor();

  const { session } = useAuth();

  // Initialize workflow manager with initial nodes and edges
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

  // Use category management hook
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

  // Event Handlers
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
    setWorkflowName(workflow.name);
    setWorkflowDescription(workflow.description);
    setTags(workflow.tags);
    setCategory(categories?.find(cat => cat.id === workflow.category) || null);
    setIsCreateMode(true);
  };

  const handleWorkflowRun = (workflow: any) => {
    toast.success(`Workflow "${workflow.name}" run`);
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
              <WorkflowList
                isLoading={isLoading}
                workflows={workflows}
                onDelete={handleWorkflowDelete}
                onEditDetails={handleWorkflowEditDetails}
                onRun={handleWorkflowRun}
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
