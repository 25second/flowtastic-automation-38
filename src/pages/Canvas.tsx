
import { WorkflowStateProvider } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useState, useCallback, useEffect } from "react";
import { FlowNodeWithData } from "@/types/flow";
import { Edge, ReactFlowInstance, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { EyeIcon, PlayIcon, SaveIcon, SparklesIcon, VideoIcon } from "lucide-react";
import { ScriptDialog } from "@/components/flow/ScriptDialog";
import { WorkflowRunDialog } from "@/components/workflow/WorkflowRunDialog";
import { useServerState } from "@/hooks/useServerState";
import { toast } from "sonner";
import '@xyflow/react/dist/style.css';

const CanvasContent = () => {
  const [showScript, setShowScript] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [isForRecording, setIsForRecording] = useState(false);
  const [nodes, setNodes] = useState<FlowNodeWithData[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const reactFlowInstance = useReactFlow();

  const {
    startRecording,
    stopRecording,
    selectedBrowser,
    startWorkflow
  } = useServerState();

  const { handleDragOver, handleDrop } = useDragAndDrop(nodes, setNodes);

  // Copy/Paste functionality
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) { // Support both Windows/Linux and macOS
      const selectedNodes = nodes.filter(node => node.selected);

      if (event.key === 'c' && selectedNodes.length > 0) {
        // Store selected nodes in localStorage (as clipboard)
        const nodesToCopy = selectedNodes.map(node => ({
          ...node,
          id: undefined, // Remove id so new ones will be generated
          position: {
            x: node.position.x + 50, // Offset position for paste
            y: node.position.y + 50
          }
        }));
        localStorage.setItem('clipboard-nodes', JSON.stringify(nodesToCopy));
        toast.success('Nodes copied');
      }

      if (event.key === 'v') {
        const clipboardData = localStorage.getItem('clipboard-nodes');
        if (clipboardData) {
          try {
            const nodesToPaste = JSON.parse(clipboardData);
            
            // Generate new IDs for pasted nodes
            const newNodes = nodesToPaste.map((node: FlowNodeWithData) => ({
              ...node,
              id: `${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              selected: false,
              style: {
                ...node.style,
                width: node.style?.width || 180
              }
            }));

            setNodes([...nodes, ...newNodes]);
            toast.success('Nodes pasted');
          } catch (error) {
            console.error('Error pasting nodes:', error);
            toast.error('Failed to paste nodes');
          }
        }
      }
    }
  }, [nodes, setNodes]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const handleStartWorkflow = () => {
    setIsForRecording(false);
    setShowBrowserDialog(true);
  };

  const handleCreateWithAI = () => {
    toast.info("AI workflow creation coming soon!");
  };

  const handleSave = () => {
    toast.info("Workflow save functionality coming soon!");
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
      setIsForRecording(true);
      setShowBrowserDialog(true);
    }
  };

  const handleBrowserConfirm = async () => {
    if (!selectedBrowser) {
      toast.error("Please select a browser");
      return;
    }

    try {
      if (isForRecording) {
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

        await startWorkflow(nodes, edges, executionParams);
        toast.success("Workflow started successfully");
      }
      setShowBrowserDialog(false);
    } catch (error) {
      console.error("Error in browser confirmation:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
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
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          const updatedNodes = changes.reduce((nodes, change) => {
            if (change.type === 'position' || change.type === 'dimensions') {
              return nodes.map(node => 
                node.id === change.id ? { ...node, ...change } : node
              );
            }
            return nodes;
          }, nodes);
          setNodes(updatedNodes);
        }}
        onEdgesChange={(changes) => {
          // Handle edge changes if needed
          setEdges(edges);
        }}
        onConnect={() => {}}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <ScriptDialog
          open={showScript}
          onOpenChange={setShowScript}
          nodes={nodes}
          edges={edges}
        />
        <WorkflowRunDialog
          showBrowserDialog={showBrowserDialog}
          setShowBrowserDialog={setShowBrowserDialog}
          onConfirm={handleBrowserConfirm}
          isForRecording={isForRecording}
        />
      </FlowLayout>
    </>
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
