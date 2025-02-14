
import { useState } from 'react';
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { WorkflowActions } from './WorkflowActions';
import { WorkflowRunner } from './WorkflowRunner';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import { nodeTypes } from '@/components/flow/CustomNode';
import { WorkflowFilters } from '../workflow/list/WorkflowFilters';

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
  const [categories, setCategories] = useState<string[]>(['Development', 'Testing', 'Production']);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleAddCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
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
