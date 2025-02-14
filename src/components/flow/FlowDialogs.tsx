
import { WorkflowRunDialog } from '@/components/workflow/WorkflowRunDialog';
import { AIDialog } from './AIDialog';
import { ServerDialog } from './ServerDialog';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { Category } from '@/types/workflow';
import { FlowNodeWithData } from '@/types/flow';
import { Edge } from '@xyflow/react';

interface FlowDialogsProps {
  nodes: FlowNodeWithData[];
  edges: Edge[];
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  setNodes: (nodes: FlowNodeWithData[]) => void;
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
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  category: Category | null;
  onCategoryChange: (category: Category) => void;
  categories: Category[];
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  showRecordDialog: boolean;
  setShowRecordDialog: (show: boolean) => void;
  handleStartWorkflow: () => void;
  handleRecordClick: () => void;
}

export function FlowDialogs({
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
}: FlowDialogsProps) {
  return (
    <>
      <AIDialog
        show={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        prompt={prompt}
        setPrompt={setPrompt}
        setNodes={setNodes}
        setEdges={setEdges}
      />

      <ServerDialog
        show={showServerDialog}
        onClose={() => setShowServerDialog(false)}
        serverToken={serverToken}
        onTokenChange={setServerToken}
        onRegister={registerServer}
      />

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
      
      {/* Dialog for starting workflow */}
      <WorkflowRunDialog
        showBrowserDialog={showBrowserDialog}
        setShowBrowserDialog={setShowBrowserDialog}
        onConfirm={handleStartWorkflow}
        isForRecording={false}
      />

      {/* Dialog for recording */}
      <WorkflowRunDialog
        showBrowserDialog={showRecordDialog}
        setShowBrowserDialog={setShowRecordDialog}
        onConfirm={handleRecordClick}
        isForRecording={true}
      />
    </>
  );
}
