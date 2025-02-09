
import { AIDialog } from './AIDialog';
import { ServerDialog } from './ServerDialog';
import { BrowserSelectDialog } from './BrowserSelectDialog';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';

interface WorkflowDialogsProps {
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  showServerDialog: boolean;
  setShowServerDialog: (show: boolean) => void;
  serverToken: string;
  setServerToken: (token: string) => void;
  onRegisterServer: () => void;
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  showRecordDialog: boolean;
  setShowRecordDialog: (show: boolean) => void;
  servers: any[];
  selectedServer: string;
  onServerSelect: (server: string) => void;
  browsers: any[];
  selectedBrowser: number | null;
  onBrowserSelect: (browser: number) => void;
  onStartWorkflow: (browserPort: number) => Promise<void>;
  onRecordWorkflow: (browserPort: number) => Promise<void>;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  workflowName: string;
  workflowDescription: string;
  onWorkflowNameChange: (name: string) => void;
  onWorkflowDescriptionChange: (desc: string) => void;
  onSaveWorkflow: () => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const WorkflowDialogs = ({
  showAIDialog,
  setShowAIDialog,
  prompt,
  setPrompt,
  showServerDialog,
  setShowServerDialog,
  serverToken,
  setServerToken,
  onRegisterServer,
  showBrowserDialog,
  setShowBrowserDialog,
  showRecordDialog,
  setShowRecordDialog,
  servers,
  selectedServer,
  onServerSelect,
  browsers,
  selectedBrowser,
  onBrowserSelect,
  onStartWorkflow,
  onRecordWorkflow,
  showSaveDialog,
  setShowSaveDialog,
  workflowName,
  workflowDescription,
  onWorkflowNameChange,
  onWorkflowDescriptionChange,
  onSaveWorkflow,
  tags,
  onTagsChange,
}: WorkflowDialogsProps) => {
  return (
    <>
      <SaveWorkflowDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onNameChange={onWorkflowNameChange}
        onDescriptionChange={onWorkflowDescriptionChange}
        onSave={onSaveWorkflow}
        tags={tags}
        onTagsChange={onTagsChange}
      />

      <AIDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        prompt={prompt}
        setPrompt={setPrompt}
      />

      <ServerDialog
        open={showServerDialog}
        onOpenChange={setShowServerDialog}
        serverToken={serverToken}
        setServerToken={setServerToken}
        onRegister={onRegisterServer}
      />

      <BrowserSelectDialog
        open={showBrowserDialog}
        onOpenChange={setShowBrowserDialog}
        servers={servers}
        selectedServer={selectedServer}
        onServerSelect={onServerSelect}
        browsers={browsers}
        selectedBrowser={selectedBrowser}
        onBrowserSelect={onBrowserSelect}
        onConfirm={async () => selectedBrowser && await onStartWorkflow(selectedBrowser)}
      />

      <BrowserSelectDialog
        open={showRecordDialog}
        onOpenChange={setShowRecordDialog}
        servers={servers}
        selectedServer={selectedServer}
        onServerSelect={onServerSelect}
        browsers={browsers}
        selectedBrowser={selectedBrowser}
        onBrowserSelect={onBrowserSelect}
        onConfirm={async () => selectedBrowser && await onRecordWorkflow(selectedBrowser)}
      />
    </>
  );
};
