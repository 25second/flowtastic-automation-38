
import { useState } from 'react';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { ScriptDialog } from './ScriptDialog';
import { WorkflowStartDialog } from './WorkflowStartDialog';
import { BrowserSelectDialog } from './BrowserSelectDialog';
import { ServerDialog } from './ServerDialog';
import { AIDialog } from './AIDialog';
import { useFlowState } from '@/hooks/useFlowState';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Category } from '@/types/workflow';

interface DialogManagerProps {
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  showScriptDialog: boolean;
  setShowScriptDialog: (show: boolean) => void;
  showStartDialog: boolean;
  setShowStartDialog: (show: boolean) => void;
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  showServerDialog: boolean;
  setShowServerDialog: (show: boolean) => void;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  onStartConfirm: () => Promise<void>;
}

export function DialogManager({
  showSaveDialog,
  setShowSaveDialog,
  showScriptDialog,
  setShowScriptDialog,
  showStartDialog,
  setShowStartDialog,
  showBrowserDialog,
  setShowBrowserDialog,
  showServerDialog,
  setShowServerDialog,
  showAIDialog,
  setShowAIDialog,
  onStartConfirm,
}: DialogManagerProps) {
  const { nodes, edges } = useFlowState();
  const {
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    saveWorkflow,
  } = useWorkflowManager(nodes, edges);

  const [category, setCategory] = useState<Category | null>(null);
  const [serverToken, setServerToken] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const handleSave = async () => {
    await saveWorkflow.mutateAsync({ nodes, edges });
    setShowSaveDialog(false);
  };

  const handleGenerate = async (flow: { nodes: any[]; edges: any[] }) => {
    console.log('Generating flow:', flow);
    // Implement AI flow generation logic here
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
        categories={[]} // You'll need to pass the actual categories here
      />
      <ScriptDialog
        open={showScriptDialog}
        onOpenChange={setShowScriptDialog}
        nodes={nodes}
        edges={edges}
      />
      <WorkflowStartDialog
        open={showStartDialog}
        onOpenChange={setShowStartDialog}
        onConfirm={onStartConfirm}
      />
      <BrowserSelectDialog
        open={showBrowserDialog}
        onOpenChange={setShowBrowserDialog}
        onConfirm={onStartConfirm}
        dialogTitle="Select Browser"
        dialogDescription="Choose a browser to run your workflow"
        isForRecording={false}
      />
      <ServerDialog
        open={showServerDialog}
        onOpenChange={setShowServerDialog}
        token={serverToken}
        setToken={setServerToken}
        onRegister={() => {
          console.log('Server registration');
          // Implement server registration logic here
        }}
      />
      <AIDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        prompt={aiPrompt}
        setPrompt={setAiPrompt}
        onGenerate={handleGenerate}
      />
    </>
  );
}
