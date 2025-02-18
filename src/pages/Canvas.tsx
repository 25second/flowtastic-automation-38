
import { WorkflowStateProvider } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useState } from "react";
import { FlowNodeWithData } from "@/types/flow";
import { Edge, ReactFlowProvider } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { EyeIcon, PlayIcon, SaveIcon, SparklesIcon, VideoIcon } from "lucide-react";
import { ScriptDialog } from "@/components/flow/ScriptDialog";
import { WorkflowRunDialog } from "@/components/workflow/WorkflowRunDialog";
import { useServerState } from "@/hooks/useServerState";
import '@xyflow/react/dist/style.css';

const CanvasContent = () => {
  const [showScript, setShowScript] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [isForRecording, setIsForRecording] = useState(false);

  const {
    startRecording,
    stopRecording,
    selectedBrowser
  } = useServerState();

  const handleStartWorkflow = () => {
    setIsForRecording(false);
    setShowBrowserDialog(true);
  };

  const handleCreateWithAI = () => {
    console.log("Create with AI clicked");
    // AI functionality to be implemented
  };

  const handleSave = () => {
    console.log("Save clicked");
    // Save functionality to be implemented
  };

  const handleRecordClick = async () => {
    if (isRecording) {
      const recordedNodes = await stopRecording();
      console.log("Recorded nodes:", recordedNodes);
      setIsRecording(false);
    } else {
      setIsForRecording(true);
      setShowBrowserDialog(true);
    }
  };

  const handleBrowserConfirm = async () => {
    if (!selectedBrowser) return;

    if (isForRecording) {
      const port = typeof selectedBrowser === 'number' 
        ? selectedBrowser 
        : selectedBrowser.debug_port || 0;
      
      await startRecording(port);
      setIsRecording(true);
    }
    // Handle workflow execution case
  };

  return (
    <WorkflowStateProvider>
      {(flowState) => {
        const { handleDragOver, handleDrop } = useDragAndDrop(flowState.nodes, flowState.setNodes);
        
        return (
          <FlowLayout
            nodes={flowState.nodes}
            edges={flowState.edges}
            onNodesChange={flowState.onNodesChange}
            onEdgesChange={flowState.onEdgesChange}
            onConnect={flowState.onConnect}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="h-full w-full relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleStartWorkflow}
                >
                  <PlayIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleCreateWithAI}
                >
                  <SparklesIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleSave}
                >
                  <SaveIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleRecordClick}
                  className={isRecording ? "text-red-500" : ""}
                >
                  <VideoIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setShowScript(true)}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </div>
              <ScriptDialog
                open={showScript}
                onOpenChange={setShowScript}
                nodes={flowState.nodes}
                edges={flowState.edges}
              />
              <WorkflowRunDialog
                showBrowserDialog={showBrowserDialog}
                setShowBrowserDialog={setShowBrowserDialog}
                onConfirm={handleBrowserConfirm}
                isForRecording={isForRecording}
              />
            </div>
          </FlowLayout>
        );
      }}
    </WorkflowStateProvider>
  );
};

const Canvas = () => {
  return (
    <div className="w-full h-screen bg-background">
      <ReactFlowProvider>
        <CanvasContent />
      </ReactFlowProvider>
    </div>
  );
};

export default Canvas;
