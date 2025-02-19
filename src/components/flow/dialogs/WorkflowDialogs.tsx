
import { ScriptDialog } from "@/components/flow/ScriptDialog";
import { WorkflowStartDialog } from "@/components/flow/WorkflowStartDialog";
import { SaveWorkflowDialog } from "@/components/flow/SaveWorkflowDialog";
import { FlowState } from "@/components/flow/WorkflowStateProvider";

interface WorkflowDialogsProps {
  showScript: boolean;
  setShowScript: (show: boolean) => void;
  showStartDialog: boolean;
  setShowStartDialog: (show: boolean) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  flowState: FlowState;
  onStartConfirm: () => Promise<void>;
}

export const WorkflowDialogs = ({
  showScript,
  setShowScript,
  showStartDialog,
  setShowStartDialog,
  showSaveDialog,
  setShowSaveDialog,
  flowState,
  onStartConfirm
}: WorkflowDialogsProps) => {
  return (
    <>
      <ScriptDialog
        open={showScript}
        onOpenChange={setShowScript}
        nodes={flowState.nodes}
        edges={flowState.edges}
      />
      <WorkflowStartDialog
        open={showStartDialog}
        onOpenChange={setShowStartDialog}
        onConfirm={onStartConfirm}
      />
      <SaveWorkflowDialog 
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        nodes={flowState.nodes}
        edges={flowState.edges}
        onSave={() => {
          flowState.saveWorkflow({ nodes: flowState.nodes, edges: flowState.edges });
          setShowSaveDialog(false);
        }}
      />
    </>
  );
};
