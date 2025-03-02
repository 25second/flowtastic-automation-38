
import React from 'react';
import { ScriptDialog } from './ScriptDialog';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { ServerDialog } from './ServerDialog';
import { WorkflowStartDialog } from './WorkflowStartDialog';
import { Edge, Node } from '@xyflow/react';
import { Category } from '@/types/workflow';
import { FlowNodeWithData } from '@/types/flow';

interface FlowDialogsProps {
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  showServerDialog: boolean;
  setShowServerDialog: (show: boolean) => void;
  showStartDialog: boolean;
  setShowStartDialog: (show: boolean) => void;
  nodes: FlowNodeWithData[];
  edges: Edge[];
  saveWorkflow: any;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  category: Category | null;
  setCategory: (category: Category | null) => void;
  serverToken?: string;
  setServerToken?: (token: string) => void;
  onRegister?: () => void;
}

export const FlowDialogs: React.FC<FlowDialogsProps> = ({
  showSaveDialog,
  setShowSaveDialog,
  showServerDialog,
  setShowServerDialog,
  showStartDialog,
  setShowStartDialog,
  nodes,
  edges,
  saveWorkflow,
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  tags,
  setTags,
  category,
  setCategory,
  serverToken = '',
  setServerToken = () => {},
  onRegister = () => {}
}) => {
  const handleSave = () => {
    saveWorkflow.mutate({
      nodes,
      edges,
      workflowName,
      workflowDescription,
      tags,
      category
    });
    setShowSaveDialog(false);
  };

  // Make this function async to return a Promise<void>
  const handleConfirm = async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      // Implement your confirmation logic here
      resolve();
    });
  };

  return (
    <>
      <SaveWorkflowDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        nodes={nodes}
        edges={edges}
        onSave={handleSave}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowDescription={workflowDescription}
        setWorkflowDescription={setWorkflowDescription}
        tags={tags}
        setTags={setTags}
        category={category}
        setCategory={setCategory}
        categories={[]}
      />
      <ServerDialog
        open={showServerDialog}
        onOpenChange={setShowServerDialog}
        token={serverToken}
        setToken={setServerToken}
        onRegister={onRegister}
      />
      <WorkflowStartDialog
        open={showStartDialog}
        onOpenChange={setShowStartDialog}
        onConfirm={handleConfirm}
      />
    </>
  );
};
