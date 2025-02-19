
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ServerMenu } from "./server-select/ServerMenu";
import { Button } from "@/components/ui/button";
import { useWorkflowStart } from "./workflow-start/useWorkflowStart";
import { SessionSelectionSection } from "./workflow-start/SessionSelectionSection";
import { LinkenSphereSession } from "@/hooks/linkenSphere";

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

    if (typeof selectedBrowser === 'object' && selectedBrowser !== null) {
      // Handle LinkenSphere session
      if (!selectedBrowser.debug_port) {
        console.error('Invalid LinkenSphere session or missing debug port');
        return;
      }
    } else if (typeof selectedBrowser === 'number') {
      // Handle Chrome browser port
      if (selectedBrowser <= 0) {
        console.error('Invalid Chrome browser port');
        return;
      }
    } else {
      console.error('Invalid browser selection');
      return;
    }

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
