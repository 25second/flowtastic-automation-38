
import React from 'react';
import { WorkflowEditor } from '@/components/workflow/WorkflowEditor';
import { FlowNodeWithData } from '@/types/flow';
import { Category } from '@/types/workflow';
import { Edge } from '@xyflow/react';
import { UseMutationResult } from '@tanstack/react-query';

interface WorkflowEditorViewProps {
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
  saveWorkflow: UseMutationResult<any, Error, any, unknown>;
  refreshWorkflows: () => void;
  onCancel: () => void;
}

export const WorkflowEditorView: React.FC<WorkflowEditorViewProps> = ({
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
  return (
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
      onCancel={onCancel}
    />
  );
};
