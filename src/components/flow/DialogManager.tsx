
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { ScriptDialog } from './ScriptDialog';
import { WorkflowStartDialog } from './WorkflowStartDialog';
import { BrowserSelectDialog } from './BrowserSelectDialog';
import { ServerDialog } from './ServerDialog';
import { AIDialog } from './AIDialog';
import { useFlowState } from '@/hooks/useFlowState';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';

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
    category,
    setCategory,
    saveWorkflow,
  } = useWorkflowManager(nodes, edges);

  const handleSave = async () => {
    await saveWorkflow.mutateAsync({ nodes, edges });
    setShowSaveDialog(false);
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
      />
      <ServerDialog
        open={showServerDialog}
        onOpenChange={setShowServerDialog}
      />
      <AIDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
      />
    </>
  );
}
