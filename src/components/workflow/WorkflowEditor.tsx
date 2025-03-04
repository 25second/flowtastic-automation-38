
import React from 'react';
import { Edge } from '@xyflow/react';
import { WorkflowCanvas } from '@/components/flow/WorkflowCanvas';
import { Category } from '@/types/workflow';
import { FlowNodeWithData } from '@/types/flow';
import { toast } from 'sonner';

interface WorkflowEditorProps {
  selectedWorkflow: any;
  initialNodes: FlowNodeWithData[];
  initialEdges: Edge[];
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  category: Category | null;
  setCategory: (category: Category | null) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  saveWorkflow: any;
  refreshWorkflows: () => void;
  onCancel: () => void;
}

export const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  selectedWorkflow,
  initialNodes,
  initialEdges,
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
  refreshWorkflows,
  onCancel
}) => {
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
      toast.success('Workflow saved successfully');
      onCancel();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <WorkflowCanvas
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
      onSave={handleSave}
      onCancel={onCancel}
    />
  );
};
