
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ServerMenu } from "./server-select/ServerMenu";
import { Button } from "@/components/ui/button";
import { useWorkflowStart } from "./workflow-start/useWorkflowStart";
import { SessionSelectionSection } from "./workflow-start/SessionSelectionSection";

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

    console.log('Confirming with browser:', selectedBrowser);
    console.log('Selected servers:', Array.from(selectedServers));
    console.log('Server token:', serverToken);
    await onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-8">
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
              Start Workflow
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
