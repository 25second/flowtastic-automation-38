
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import { toast } from "sonner";
import { WorkflowStateProvider, FlowState } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useServerState } from "@/hooks/useServerState";
import { ActionButtons } from "@/components/flow/toolbar/ActionButtons";
import { WorkflowDialogs } from "@/components/flow/dialogs/WorkflowDialogs";

const CanvasContent = () => {
  const [showScript, setShowScript] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const location = useLocation();
  const existingWorkflow = location.state?.workflow;

  const {
    startRecording,
    stopRecording,
    selectedBrowser,
    startWorkflow,
    selectedServer,
    serverToken,
  } = useServerState();

  const handleStartWorkflow = () => {
    setShowStartDialog(true);
  };

  const handleSave = (flowState: FlowState) => {
    if (existingWorkflow) {
      flowState.saveWorkflow({ 
        id: existingWorkflow.id,
        nodes: flowState.nodes, 
        edges: flowState.edges 
      });
      toast.success("Workflow saved successfully");
    } else {
      setShowSaveDialog(true);
    }
  };

  const handleRecordClick = async () => {
    if (isRecording) {
      try {
        const recordedNodes = await stopRecording();
        console.log("Recorded nodes:", recordedNodes);
        setIsRecording(false);
        toast.success("Recording stopped successfully");
      } catch (error) {
        console.error("Error stopping recording:", error);
        toast.error("Failed to stop recording");
      }
    } else {
      setIsRecording(true);
      setShowStartDialog(true);
    }
  };

  return (
    <WorkflowStateProvider>
      {(flowState) => {
        const { handleDragOver, handleDrop } = useDragAndDrop(flowState.nodes, flowState.setNodes);
        
        const handleStartConfirm = async () => {
          console.log("=== Starting workflow execution ===");
          console.log("Selected browser:", selectedBrowser);
          console.log("Selected server:", selectedServer);
          console.log("Server token:", serverToken);
          console.log("Nodes:", flowState.nodes);
          console.log("Edges:", flowState.edges);

          if (!selectedBrowser || !selectedServer) {
            toast.error("Please select both a server and a session");
            return;
          }

          try {
            if (isRecording) {
              const port = typeof selectedBrowser === 'number' 
                ? selectedBrowser 
                : selectedBrowser.debug_port || 0;
              
              await startRecording(port);
              setIsRecording(true);
              toast.success("Recording started");
            } else {
              const executionParams = typeof selectedBrowser === 'object' && selectedBrowser !== null
                ? {
                    browserType: 'linkenSphere' as const,
                    browserPort: selectedBrowser.debug_port || 0,
                    sessionId: selectedBrowser.id
                  }
                : {
                    browserType: 'chrome' as const,
                    browserPort: selectedBrowser as number
                  };

              if (!executionParams.browserPort) {
                toast.error("Invalid browser port");
                return;
              }

              await startWorkflow(flowState.nodes, flowState.edges, executionParams);
              toast.success("Workflow started successfully");
            }
            setShowStartDialog(false);
          } catch (error) {
            console.error("Error in workflow execution:", error);
            toast.error(error instanceof Error ? error.message : "An error occurred");
          }
        };
        
        return (
          <>
            <ActionButtons
              onStartWorkflow={handleStartWorkflow}
              onSave={handleSave}
              onRecord={handleRecordClick}
              onShowScript={() => setShowScript(true)}
              isRecording={isRecording}
              flowState={flowState}
            />

            <FlowLayout
              nodes={flowState.nodes}
              edges={flowState.edges}
              onNodesChange={flowState.onNodesChange}
              onEdgesChange={flowState.onEdgesChange}
              onConnect={flowState.onConnect}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <WorkflowDialogs
                showScript={showScript}
                setShowScript={setShowScript}
                showStartDialog={showStartDialog}
                setShowStartDialog={setShowStartDialog}
                showSaveDialog={showSaveDialog}
                setShowSaveDialog={setShowSaveDialog}
                flowState={flowState}
                onStartConfirm={handleStartConfirm}
              />
            </FlowLayout>
          </>
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
