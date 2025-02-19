
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServerMenu } from "./server-select/ServerMenu";
import { Button } from "@/components/ui/button";
import { useWorkflowStart } from "./workflow-start/useWorkflowStart";
import { SessionSelectionSection } from "./workflow-start/SessionSelectionSection";
import { useState } from "react";
import { WorkflowExecutionDialog } from "./workflow-execution/WorkflowExecutionDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkflowStartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export const WorkflowStartDialog = ({
  open,
  onOpenChange,
  onConfirm
}: WorkflowStartDialogProps) => {
  const [showExecutionDialog, setShowExecutionDialog] = useState(false);
  
  const {
    selectedServer,
    selectedServers,
    serverOptions,
    selectedBrowser,
    serverToken,
    sessions,
    loading,
    selectedSessions,
    searchQuery,
    setSearchQuery,
    handleServerSelect,
    handleToggleSession,
    startSession,
    stopSession,
    startSelectedSessions,
    stopSelectedSessions,
    loadingSessions,
    isSessionActive,
    validateWorkflowStart
  } = useWorkflowStart(open);

  const handleConfirm = async () => {
    if (!validateWorkflowStart()) {
      return;
    }

    // Close the selection dialog and open the execution dialog
    onOpenChange(false);
    setShowExecutionDialog(true);
    
    // Start the workflow execution
    await onConfirm();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Select Sessions for Workflow</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[600px]">
            <div className="space-y-8 p-4">
              <ServerMenu
                servers={serverOptions}
                selectedServers={selectedServers}
                onServerSelect={handleServerSelect}
              />

              {selectedServer && (
                <SessionSelectionSection
                  loading={loading}
                  sessions={sessions}
                  selectedSessions={selectedSessions}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onToggleSession={handleToggleSession}
                  startSession={startSession}
                  stopSession={stopSession}
                  startSelectedSessions={startSelectedSessions}
                  stopSelectedSessions={stopSelectedSessions}
                  isSessionActive={isSessionActive}
                  loadingSessions={loadingSessions}
                />
              )}

              {selectedServer && (
                <Button 
                  onClick={handleConfirm}
                  className="w-full"
                  disabled={selectedServers.size === 0 || !selectedBrowser}
                >
                  Launch Workflow
                </Button>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <WorkflowExecutionDialog
        open={showExecutionDialog}
        onOpenChange={setShowExecutionDialog}
        selectedBrowser={selectedBrowser}
        selectedServer={selectedServer}
      />
    </>
  );
};
