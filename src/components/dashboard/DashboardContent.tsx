
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowList } from '@/components/workflow/WorkflowList';
import { Node, Edge } from '@xyflow/react';
import { WorkflowActions } from './WorkflowActions';
import { WorkflowRunner } from './WorkflowRunner';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import { nodeTypes } from '@/components/flow/CustomNode';

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
  const navigate = useNavigate();
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);

  const handleRunWorkflow = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setShowBrowserDialog(true);
  };

  const handleEditDetails = (workflow: any) => {
    setEditingWorkflow(workflow);
    setWorkflowName(workflow.name);
    setWorkflowDescription(workflow.description || '');
    setTags(workflow.tags || []);
  };

  const handleDeleteWorkflows = (ids: string[]) => {
    ids.forEach(id => deleteWorkflow.mutate(id));
    if (editingWorkflow && ids.includes(editingWorkflow.id)) {
      setEditingWorkflow(null);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Workflows</h2>
        <WorkflowActions
          workflowName={workflowName}
          setWorkflowName={setWorkflowName}
          workflowDescription={workflowDescription}
          setWorkflowDescription={setWorkflowDescription}
          tags={tags}
          setTags={setTags}
          saveWorkflow={saveWorkflow}
          editingWorkflow={editingWorkflow}
          setEditingWorkflow={setEditingWorkflow}
          showEditDialog={!!editingWorkflow}
          setShowEditDialog={(show) => !show && setEditingWorkflow(null)}
        />
      </div>

      {editingWorkflow ? (
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
      ) : null}

      <WorkflowList
        workflows={workflows}
        isLoading={isLoading}
        onDelete={handleDeleteWorkflows}
        onEditDetails={handleEditDetails}
        onRun={handleRunWorkflow}
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
