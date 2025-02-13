
import { Node, Edge } from '@xyflow/react';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { Toolbar } from '@/components/flow/Toolbar';
import { SaveWorkflowDialog } from '@/components/flow/SaveWorkflowDialog';
import { AIDialog } from '@/components/flow/AIDialog';
import { ServerDialog } from '@/components/flow/ServerDialog';
import { BrowserSelectDialog } from '@/components/flow/BrowserSelectDialog';

interface FlowContainerProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  browsers: Array<{port: number, name: string, type: string}>;
  selectedBrowser: number | null;
  onBrowserSelect: (port: number) => void;
  onStartWorkflow: (browserPort: number) => Promise<void>;
  onCreateWithAI: () => void;
  onSave: () => void;
  isRecording: boolean;
  onRecordClick: () => Promise<void>;
  onStartWithDialog: () => void;
  onRecordWithDialog: () => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  workflowName: string;
  workflowDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  onSaveWorkflow: () => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  showServerDialog: boolean;
  setShowServerDialog: (show: boolean) => void;
  serverToken: string;
  setServerToken: (token: string) => void;
  onRegisterServer: () => void;
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  selectedServer: string;
  onServerSelect: (serverId: string) => void;
  onConfirmAction: () => Promise<void>;
  servers: any[];
}

export const FlowContainer = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDragOver,
  onDrop,
  browsers,
  selectedBrowser,
  onBrowserSelect,
  onStartWorkflow,
  onCreateWithAI,
  onSave,
  isRecording,
  onRecordClick,
  onStartWithDialog,
  onRecordWithDialog,
  showSaveDialog,
  setShowSaveDialog,
  workflowName,
  workflowDescription,
  onNameChange,
  onDescriptionChange,
  onSaveWorkflow,
  tags,
  onTagsChange,
  showAIDialog,
  setShowAIDialog,
  prompt,
  setPrompt,
  showServerDialog,
  setShowServerDialog,
  serverToken,
  setServerToken,
  onRegisterServer,
  showBrowserDialog,
  setShowBrowserDialog,
  selectedServer,
  onServerSelect,
  onConfirmAction,
  servers,
}: FlowContainerProps) => {
  return (
    <FlowLayout
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Toolbar 
        browsers={browsers}
        selectedBrowser={selectedBrowser}
        onBrowserSelect={onBrowserSelect}
        onStartWorkflow={onStartWorkflow}
        onCreateWithAI={onCreateWithAI}
        onSave={onSave}
        isRecording={isRecording}
        onRecordClick={onRecordClick}
        onStartWithDialog={onStartWithDialog}
        onRecordWithDialog={onRecordWithDialog}
      />

      <SaveWorkflowDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onNameChange={onNameChange}
        onDescriptionChange={onDescriptionChange}
        onSave={onSaveWorkflow}
        tags={tags}
        onTagsChange={onTagsChange}
      />

      <AIDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        prompt={prompt}
        setPrompt={setPrompt}
      />

      <ServerDialog
        open={showServerDialog}
        onOpenChange={setShowServerDialog}
        serverToken={serverToken}
        setServerToken={setServerToken}
        onRegister={onRegisterServer}
      />

      <BrowserSelectDialog
        open={showBrowserDialog}
        onOpenChange={setShowBrowserDialog}
        servers={servers}
        selectedServer={selectedServer}
        onServerSelect={onServerSelect}
        browsers={browsers}
        selectedBrowser={selectedBrowser}
        onBrowserSelect={onBrowserSelect}
        onConfirm={onConfirmAction}
      />
    </FlowLayout>
  );
};
