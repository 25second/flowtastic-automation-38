
import { AIDialog } from '@/components/flow/AIDialog';
import { ServerDialog } from '@/components/flow/ServerDialog';
import { SaveWorkflowDialog } from '@/components/flow/SaveWorkflowDialog';
import { WorkflowRunner } from '@/components/dashboard/WorkflowRunner';
import { Node, Edge } from '@xyflow/react';

interface DialogManagerProps {
  nodes: Node[];
  edges: Edge[];
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  showServerDialog: boolean;
  setShowServerDialog: (show: boolean) => void;
  serverToken: string;
  setServerToken: (token: string) => void;
  registerServer: () => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  workflowName: string;
  workflowDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  onSave: () => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  showRecordDialog: boolean;
  setShowRecordDialog: (show: boolean) => void;
  handleStartWorkflow: () => Promise<void>;
  handleRecordClick: () => Promise<void>;
}

export const DialogManager = ({
  nodes,
  edges,
  showAIDialog,
  setShowAIDialog,
  prompt,
  setPrompt,
  setNodes,
  setEdges,
  showServerDialog,
  setShowServerDialog,
  serverToken,
  setServerToken,
  registerServer,
  showSaveDialog,
  setShowSaveDialog,
  workflowName,
  workflowDescription,
  onNameChange,
  onDescriptionChange,
  onSave,
  tags,
  onTagsChange,
  category,
  onCategoryChange,
  categories,
  showBrowserDialog,
  setShowBrowserDialog,
  showRecordDialog,
  setShowRecordDialog,
  handleStartWorkflow,
  handleRecordClick,
}: DialogManagerProps) => {
  return (
    <>
      <SaveWorkflowDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onNameChange={onNameChange}
        onDescriptionChange={onDescriptionChange}
        onSave={onSave}
        tags={tags}
        onTagsChange={onTagsChange}
        category={category}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />

      <AIDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        prompt={prompt}
        setPrompt={setPrompt}
        setNodes={setNodes}
        setEdges={setEdges}
      />

      <ServerDialog
        open={showServerDialog}
        onOpenChange={setShowServerDialog}
        serverToken={serverToken}
        setServerToken={setServerToken}
        onRegister={registerServer}
      />

      <WorkflowRunner
        selectedWorkflow={{ nodes, edges }}
        setSelectedWorkflow={() => {}}
        showBrowserDialog={showBrowserDialog}
        setShowBrowserDialog={setShowBrowserDialog}
        onConfirm={handleStartWorkflow}
      />

      <WorkflowRunner
        selectedWorkflow={{ nodes, edges }}
        setSelectedWorkflow={() => {}}
        showBrowserDialog={showRecordDialog}
        setShowBrowserDialog={setShowRecordDialog}
        onConfirm={handleRecordClick}
      />
    </>
  );
};
