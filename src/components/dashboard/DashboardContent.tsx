
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
  const [category, setCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories from Supabase
  const { data: categories = [], refetch: refetchCategories } = useQuery({
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
      
      return data.map(cat => cat.name);
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
    setCategory(workflow.category || '');
  };

  const handleDeleteWorkflows = (ids: string[]) => {
    ids.forEach(id => deleteWorkflow.mutate(id));
    if (editingWorkflow && ids.includes(editingWorkflow.id)) {
      setEditingWorkflow(null);
    }
  };

  const handleAddCategory = async (newCategory: string) => {
    try {
      const { error } = await supabase
        .from('workflow_categories')
        .insert({ name: newCategory });

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

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      const { error } = await supabase
        .from('workflow_categories')
        .delete()
        .eq('name', categoryName);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
        return;
      }

      toast.success('Category deleted successfully');
      refetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleEditCategory = async (oldName: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('workflow_categories')
        .update({ name: newName })
        .eq('name', oldName);

      if (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category');
        return;
      }

      toast.success('Category updated successfully');
      refetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
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
            saveWorkflow={saveWorkflow}
            editingWorkflow={editingWorkflow}
            setEditingWorkflow={setEditingWorkflow}
            showEditDialog={!!editingWorkflow}
            setShowEditDialog={(show) => !show && setEditingWorkflow(null)}
            categories={categories}
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
        categories={categories}
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
