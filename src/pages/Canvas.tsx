import { ReactFlowProvider } from "@xyflow/react";
import { WorkflowStateProvider } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useState, useRef, useEffect } from "react";
import { ScriptDialog } from "@/components/flow/ScriptDialog";
import { useServerState } from "@/hooks/useServerState";
import { SaveWorkflowDialog } from "@/components/flow/SaveWorkflowDialog";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import '@xyflow/react/dist/style.css';
import { WorkflowStartDialog } from "@/components/flow/WorkflowStartDialog";
import { ChatPanel } from "@/components/canvas/ChatPanel";
import { TopActions } from "@/components/canvas/TopActions";
import { processNodes } from "@/utils/puppeteerConverter";
import { convertWorkflow } from "@/utils/jsonToPuppeteer";

const MIN_HEIGHT = 320;

const CanvasContent = () => {
  const [showScript, setShowScript] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatHeight, setChatHeight] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const existingWorkflow = location.state?.workflow;

  const {
    startRecording,
    stopRecording,
    selectedBrowser,
    startWorkflow,
    selectedServer,
    serverToken
  } = useServerState();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newHeight = window.innerHeight - e.clientY - 16;
        if (newHeight >= MIN_HEIGHT && newHeight <= 800) {
          setChatHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleStartWorkflow = () => {
    if (existingWorkflow) {
      navigate('/bot-launch', { 
        state: { 
          openCreateTask: true,
          selectedWorkflow: existingWorkflow
        } 
      });
    } else {
      toast.error("Please save the workflow first");
    }
  };

  return (
    <WorkflowStateProvider>
      {(flowState) => {
        const { handleDragOver, handleDrop } = useDragAndDrop(flowState.nodes, flowState.setNodes);

        const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (!file) return;

          try {
            const text = await file.text();
            
            if (file.name.endsWith('.json')) {
              console.log('Importing JSON workflow:', text);
              const workflowJson = JSON.parse(text);
              
              const { nodes: importedNodes, edges: importedEdges } = convertWorkflow(workflowJson);
              
              const updatedNodes = [...flowState.nodes, ...importedNodes];
              const updatedEdges = [...flowState.edges, ...importedEdges];
              
              flowState.setNodes(updatedNodes);
              flowState.setEdges(updatedEdges);
              
              toast.success('JSON workflow imported successfully');
            } else {
              console.log('Importing Puppeteer script:', text);
              
              const importedNodes = processNodes(text);
              const updatedNodes = [...flowState.nodes, ...importedNodes];
              flowState.setNodes(updatedNodes);
              
              toast.success('Puppeteer script imported successfully');
            }
            
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } catch (error) {
            console.error('Error importing file:', error);
            toast.error('Failed to import file');
          }
        };

        const handleImportClick = () => {
          fileInputRef.current?.click();
        };

        const handleStartConfirm = async () => {
          try {
            if (!selectedBrowser) {
              throw new Error("No browser selected");
            }
            let executionParams;
            if (typeof selectedBrowser === 'object' && selectedBrowser !== null) {
              if (!selectedBrowser.debug_port) {
                throw new Error('LinkenSphere session has no debug port');
              }
              executionParams = {
                browserType: 'linkenSphere' as const,
                browserPort: selectedBrowser.debug_port,
                sessionId: selectedBrowser.id
              };
            } else {
              executionParams = {
                browserType: 'chrome' as const,
                browserPort: selectedBrowser
              };
            }
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

        return (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".js,.ts,.json"
              className="hidden"
            />

            <TopActions
              existingWorkflow={existingWorkflow}
              handleStartWorkflow={handleStartWorkflow}
              handleImportClick={handleImportClick}
              handleSave={handleSave}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              setShowScript={setShowScript}
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
              <ScriptDialog open={showScript} onOpenChange={setShowScript} nodes={flowState.nodes} edges={flowState.edges} />
              <WorkflowStartDialog open={showStartDialog} onOpenChange={setShowStartDialog} onConfirm={handleStartConfirm} />
              <SaveWorkflowDialog 
                open={showSaveDialog} 
                onOpenChange={setShowSaveDialog} 
                nodes={flowState.nodes} 
                edges={flowState.edges} 
                onSave={() => {
                  flowState.saveWorkflow({
                    nodes: flowState.nodes,
                    edges: flowState.edges
                  });
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

            <ChatPanel
              chatHeight={chatHeight}
              isChatMinimized={isChatMinimized}
              isResizing={isResizing}
              resizeRef={resizeRef}
              setIsResizing={setIsResizing}
              setIsChatMinimized={setIsChatMinimized}
            />
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
