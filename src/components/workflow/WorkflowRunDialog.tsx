
import { BrowserSelectDialog } from '@/components/flow/BrowserSelectDialog';

interface WorkflowRunDialogProps {
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  servers: any[];
  selectedServer: string;
  setSelectedServer: (server: string) => void;
  browsers: any[];
  selectedBrowser: number | null;
  setSelectedBrowser: (browser: number | null) => void;
  onConfirm: () => Promise<void>;
}

export function WorkflowRunDialog({
  showBrowserDialog,
  setShowBrowserDialog,
  servers,
  selectedServer,
  setSelectedServer,
  browsers,
  selectedBrowser,
  setSelectedBrowser,
  onConfirm,
}: WorkflowRunDialogProps) {
  return (
    <BrowserSelectDialog
      open={showBrowserDialog}
      onOpenChange={setShowBrowserDialog}
      servers={servers}
      selectedServer={selectedServer}
      onServerSelect={setSelectedServer}
      browsers={browsers}
      selectedBrowser={selectedBrowser}
      onBrowserSelect={setSelectedBrowser}
      onConfirm={onConfirm}
    />
  );
}
