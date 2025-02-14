
import { BrowserSelectDialog } from '@/components/flow/BrowserSelectDialog';

interface ServerOption {
  id: string;
  label: string;
  value: string;
}

interface WorkflowRunDialogProps {
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  servers: ServerOption[];
  selectedServer: string | null;
  setSelectedServer: (server: string) => void;
  browsers: Array<{port: number, name: string, type: string}>;
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
  console.log('WorkflowRunDialog render:', {
    showBrowserDialog,
    selectedServer,
    browsers,
    selectedBrowser
  });

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
