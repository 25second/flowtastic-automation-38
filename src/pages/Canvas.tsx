import { WorkflowStateProvider } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { EyeIcon, PlayIcon, SaveIcon, SparklesIcon, VideoIcon } from "lucide-react";
import { ScriptDialog } from "@/components/flow/ScriptDialog";
import { useServerState } from "@/hooks/useServerState";
import { SaveWorkflowDialog } from "@/components/flow/SaveWorkflowDialog";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import '@xyflow/react/dist/style.css';
import { WorkflowStartDialog } from "@/components/flow/WorkflowStartDialog";

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

  const handleCreateWithAI = () => {
    toast.info("AI workflow creation coming soon!");
  };

  return (
    <WorkflowStateProvider>
      {(flowState) => {
        const { handleDragOver, handleDrop } = useDragAndDrop(flowState.nodes, flowState.setNodes);

        const handleStartConfirm = async () => {
          console.log("=== Starting workflow execution ===");
          console.log("Selected browser state:", selectedBrowser);
          console.log("Selected server state:", selectedServer);
          console.log("Server token state:", serverToken);
          console.log("Workflow nodes:", flowState.nodes);
          console.log("Workflow edges:", flowState.edges);

          try {
            if (!selectedBrowser) {
              console.error("No browser selected at execution time");
              throw new Error("No browser selected");
            }

            let executionParams;
            if (typeof selectedBrowser === 'object' && selectedBrowser !== null) {
              console.log("Using LinkenSphere session:", selectedBrowser);
              if (!selectedBrowser.debug_port) {
                throw new Error('LinkenSphere session has no debug port');
              }
              executionParams = {
                browserType: 'linkenSphere' as const,
                browserPort: selectedBrowser.debug_port,
                sessionId: selectedBrowser.id
              };
            } else {
              console.log("Using Chrome browser port:", selectedBrowser);
              executionParams = {
                browserType: 'chrome' as const,
                browserPort: selectedBrowser
              };
            }

            console.log("Final execution params:", executionParams);

            if (isRecording) {
              await startRecording(executionParams.browserPort);
              setIsRecording(true);
              toast.success("Recording started");
            } else {
              await startWorkflow(flowState.nodes, flowState.edges, executionParams);
              toast.success("Workflow started successfully");
            }
            setShowStartDialog(false);
          } catch (error) {
            console.error("Error in workflow execution:", error);
            toast.error(error instanceof Error ? error.message : "An error occurred");
          }
        };

        const handleSave = () => {
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
          <>
            <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
              <Button
                onClick={handleStartWorkflow}
                className="flex items-center gap-2 bg-gradient-to-br from-[#9b87f5] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 animate-fade-in group"
              >
                <PlayIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                  Start Workflow
                </span>
              </Button>

              <Button
                onClick={handleCreateWithAI}
                className="flex items-center gap-2 bg-gradient-to-br from-[#F97316] to-[#FEC6A1] hover:from-[#EA580C] hover:to-[#FB923C] text-white shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 animate-fade-in group"
              >
                <SparklesIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                  Create with AI
                </span>
              </Button>

              <div className="flex items-center gap-3 animate-fade-in">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleSave}
                  className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg"
                >
                  <SaveIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleRecordClick}
                  className={`hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg ${isRecording ? "text-red-500 animate-pulse" : ""}`}
                >
                  <VideoIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setShowScript(true)}
                  className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg"
                >
                  <EyeIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
                </Button>
              </div>
            </div>

            <FlowLayout
              nodes={flowState.nodes}
              edges={flowState.edges}
              onNodesChange={flowState.onNodesChange}
              onEdgesChange={flowState.onEdgesChange}
              onConnect={flowState.onConnect}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <ScriptDialog
                open={showScript}
                onOpenChange={setShowScript}
                nodes={flowState.nodes}
                edges={flowState.edges}
              />
              <WorkflowStartDialog
                open={showStartDialog}
                onOpenChange={setShowStartDialog}
                onConfirm={handleStartConfirm}
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
                workflowName={flowState.workflowName}
                setWorkflowName={flowState.setWorkflowName}
                workflowDescription={flowState.workflowDescription}
                setWorkflowDescription={flowState.setWorkflowDescription}
                tags={flowState.tags}
                setTags={flowState.setTags}
                category={flowState.category}
                setCategory={flowState.setCategory}
                categories={flowState.categories}
                editingWorkflow={flowState.existingWorkflow}
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
