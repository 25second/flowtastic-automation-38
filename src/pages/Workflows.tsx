
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { WorkflowCanvas } from '@/components/flow/WorkflowCanvas';
import { supabase } from '@/integrations/supabase/client';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Node, Edge } from '@xyflow/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/types/workflow';
import { useAuth } from '@/components/auth/AuthProvider';
import { FlowNodeWithData } from '@/types/flow';
import { SidebarProvider, SidebarRail, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { WorkflowSidebar } from '@/components/workflow/WorkflowSidebar';

const WorkflowsPage = () => {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const initialNodes: FlowNodeWithData[] = [{ id: '1', type: 'start-script', position: { x: 50, y: 50 }, data: { type: 'start-script', label: 'Start Script' } }];
  const initialEdges: Edge[] = [];

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

  const { session } = useAuth();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['workflow_categories', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log('No user session found');
        return [];
      }

      const { data, error } = await supabase
        .from('workflow_categories')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        throw error;
      }

      return data as Category[];
    },
    enabled: !!session?.user,
  });

  const addCategory = useMutation({
    mutationFn: async (newCategory: { name: string; user_id: string }) => {
      const { data, error } = await supabase
        .from('workflow_categories')
        .insert([newCategory])
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to add category');
        throw error;
      }

      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow_categories'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workflow_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow_categories'] });
      setCategory(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const editCategory = useMutation({
    mutationFn: async (updatedCategory: Category) => {
      const { data, error } = await supabase
        .from('workflow_categories')
        .update(updatedCategory)
        .eq('id', updatedCategory.id)
        .select()
        .single();
  
      if (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category');
        throw error;
      }
  
      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow_categories'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (location.state?.workflow) {
      const workflowId = location.state.workflow.id;
      const workflow = workflows?.find(w => w.id === workflowId);
      setSelectedWorkflow(workflow);
      setIsCreateMode(true);
    }
  }, [location.state, workflows]);

  const handleAddCategory = (name: string) => {
    if (!session?.user) {
      toast.error('You must be logged in to add categories');
      return;
    }
    
    addCategory.mutate({
      name,
      user_id: session.user.id
    });
  };

  const handleCategoryDelete = async (categoryId: string) => {
    try {
      await deleteCategory.mutateAsync(categoryId);
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCategoryEdit = async (updatedCategory: Category) => {
    try {
      await editCategory.mutateAsync(updatedCategory);
      toast.success('Category updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
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

  const handleCategorySelect = (categoryId: string | null) => {
    setCategory(categories?.find(cat => cat.id === categoryId) || null);
  };

  const handleSave = async ({ nodes, edges }: { nodes: FlowNodeWithData[]; edges: Edge[] }) => {
    try {
      await saveWorkflow.mutateAsync({
        id: selectedWorkflow?.id,
        nodes,
        edges,
        workflowName,
        workflowDescription,
        tags,
        category,
      });
      refreshWorkflows();
      setIsCreateMode(false);
      setSelectedWorkflow(null);
      toast.success('Workflow saved successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex w-full h-[calc(100vh-4rem)]">
        <WorkflowSidebar />
        <SidebarRail />
        <SidebarInset className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Workflows</h1>
            <SidebarTrigger />
          </div>

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
            />
          ) : (
            <WorkflowCanvas
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
              onSave={handleSave}
              onCancel={() => {
                setIsCreateMode(false);
                setSelectedWorkflow(null);
                setWorkflowName('');
                setWorkflowDescription('');
                setTags([]);
                setCategory(null);
              }}
            />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default WorkflowsPage;
