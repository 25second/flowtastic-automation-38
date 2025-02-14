
import { useState, useEffect } from 'react';
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { WorkflowActions } from './WorkflowActions';
import { WorkflowRunner } from './WorkflowRunner';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import { nodeTypes } from '@/components/flow/CustomNode';
import { WorkflowFilters } from '../workflow/list/WorkflowFilters';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@/types/workflow';

interface DashboardContentProps {
  workflows: any[] | undefined;
  isLoading: boolean;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (desc: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  saveWorkflow: any;
  deleteWorkflow: any;
}

export function DashboardContent({
  workflows,
  isLoading,
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  tags,
  setTags,
  saveWorkflow,
  deleteWorkflow,
}: DashboardContentProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories from Supabase
  const { data: categoriesData = [], refetch: refetchCategories } = useQuery({
    queryKey: ['workflow-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        return [];
      }
      
      return data.map(cat => ({
        id: cat.id,
        name: cat.name,
      })) as Category[];
    }
  });

  const handleRunWorkflow = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setShowBrowserDialog(true);
  };

  const handleEditDetails = (workflow: any) => {
    setEditingWorkflow(workflow);
    setWorkflowName(workflow.name);
    setWorkflowDescription(workflow.description || '');
    setTags(workflow.tags || []);
    if (workflow.category) {
      // Найти соответствующую категорию в списке
      const workflowCategory = categoriesData.find(c => c.id === workflow.category);
      setCategory(workflowCategory || null);
    } else {
      setCategory(null);
    }
  };

  const handleDeleteWorkflows = (ids: string[]) => {
    ids.forEach(id => deleteWorkflow.mutate(id));
    if (editingWorkflow && ids.includes(editingWorkflow.id)) {
      setEditingWorkflow(null);
    }
  };

  const handleAddCategory = async (newCategory: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('User not authenticated');
        return;
      }

      const { data, error } = await supabase
        .from('workflow_categories')
        .insert({ 
          name: newCategory,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to add category');
        return;
      }

      toast.success('Category added successfully');
      refetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Workflows</h2>
        <div className="flex items-center gap-4">
          <WorkflowFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <WorkflowActions 
            workflowName={workflowName}
            setWorkflowName={setWorkflowName}
            workflowDescription={workflowDescription}
            setWorkflowDescription={setWorkflowDescription}
            tags={tags}
            setTags={setTags}
            category={category}
            setCategory={setCategory}
            categories={categoriesData}
            saveWorkflow={saveWorkflow}
            editingWorkflow={editingWorkflow}
            setEditingWorkflow={setEditingWorkflow}
            showEditDialog={!!editingWorkflow}
            setShowEditDialog={(show) => !show && setEditingWorkflow(null)}
          />
        </div>
      </div>

      {editingWorkflow && (
        <div className="h-[600px] w-full border rounded-lg overflow-hidden mb-6">
          <ReactFlow
            nodes={editingWorkflow.nodes || []}
            edges={editingWorkflow.edges || []}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      )}

      <WorkflowList
        workflows={workflows}
        isLoading={isLoading}
        onDelete={handleDeleteWorkflows}
        onEditDetails={handleEditDetails}
        onRun={handleRunWorkflow}
        categories={categoriesData}
        onAddCategory={handleAddCategory}
        searchQuery={searchQuery}
      />

      <WorkflowRunner
        selectedWorkflow={selectedWorkflow}
        setSelectedWorkflow={setSelectedWorkflow}
        showBrowserDialog={showBrowserDialog}
        setShowBrowserDialog={setShowBrowserDialog}
      />
    </div>
  );
}
