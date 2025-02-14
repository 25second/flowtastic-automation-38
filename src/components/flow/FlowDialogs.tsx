
import { AIDialog } from "./AIDialog";
import { ServerDialog } from "./ServerDialog";
import { SaveWorkflowDialog } from "./SaveWorkflowDialog";
import { WorkflowRunner } from "@/components/dashboard/WorkflowRunner";
import { Edge } from "@xyflow/react";
import { FlowNodeWithData } from "@/types/flow";

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
  registerServer: (token: string) => Promise<void>;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  workflowName: string;
  workflowDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  categories: { id: string; name: string }[];
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  showRecordDialog: boolean;
  setShowRecordDialog: (show: boolean) => void;
  onStartWorkflow: (nodes: FlowNodeWithData[], edges: Edge[], browserPort: number) => Promise<void>;
  onStartRecording: (browserPort: number) => Promise<void>;
  isRecording: boolean;
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
  onStartWorkflow,
  onStartRecording,
  isRecording,
}: FlowDialogsProps) {
  console.log('FlowDialogs render:', { showRecordDialog, isRecording });

  return (
    <>
      <AIDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={async (generatedFlow) => {
          setNodes(generatedFlow.nodes);
          setEdges(generatedFlow.edges);
        }}
      />

      <ServerDialog
        open={showServerDialog}
        onOpenChange={setShowServerDialog}
        token={serverToken}
        setToken={setServerToken}
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

      {/* WorkflowRunner для запуска рабочего процесса */}
      <WorkflowRunner
        selectedWorkflow={{ nodes, edges }}
        setSelectedWorkflow={() => {}}
        showBrowserDialog={showBrowserDialog}
        setShowBrowserDialog={setShowBrowserDialog}
        onConfirm={async () => {
          console.log('WorkflowRunner onConfirm called');
          await onStartWorkflow(nodes, edges, 0); // порт будет установлен внутри компонента
        }}
      />

      {/* WorkflowRunner для записи */}
      <WorkflowRunner
        selectedWorkflow={null}
        setSelectedWorkflow={() => {}}
        showBrowserDialog={showRecordDialog}
        setShowBrowserDialog={setShowRecordDialog}
        onConfirm={async () => {
          console.log('Record onConfirm called');
          await onStartRecording(0); // порт будет установлен внутри компонента
        }}
      />
    </>
  );
}
