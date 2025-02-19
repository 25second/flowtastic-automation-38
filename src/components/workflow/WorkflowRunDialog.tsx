
import { BrowserSelectDialog } from '@/components/flow/BrowserSelectDialog';
import { LinkenSphereSession } from '@/hooks/linkenSphere/types';

interface WorkflowRunDialogProps {
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  onConfirm: () => Promise<void>;
  isForRecording: boolean;
}

export function WorkflowRunDialog({
  showBrowserDialog,
  setShowBrowserDialog,
  onConfirm,
  isForRecording,
}: WorkflowRunDialogProps) {
  console.log('WorkflowRunDialog render:', {
    showBrowserDialog,
    isForRecording,
  });

  return (
    <BrowserSelectDialog
      open={showBrowserDialog}
      onOpenChange={setShowBrowserDialog}
      onConfirm={onConfirm}
      dialogTitle={isForRecording ? "Select Browser for Recording" : "Select Browser for Workflow"}
      dialogDescription={
        isForRecording 
          ? "Choose a browser or session to record your workflow actions. Make sure the selected session is running."
          : "Choose a browser or session to run your workflow"
      }
      isForRecording={isForRecording}
    />
  );
}
