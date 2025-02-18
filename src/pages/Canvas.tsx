
import { WorkflowStateProvider } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useState } from "react";
import { FlowNodeWithData } from "@/types/flow";
import { Edge, ReactFlowProvider, useReactFlow, Position, XYPosition } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { EyeIcon, PlayIcon, SaveIcon, SparklesIcon, VideoIcon, GroupIcon } from "lucide-react";
import { ScriptDialog } from "@/components/flow/ScriptDialog";
import { WorkflowRunDialog } from "@/components/workflow/WorkflowRunDialog";
import { useServerState } from "@/hooks/useServerState";
import { toast } from "sonner";
import '@xyflow/react/dist/style.css';

interface CanvasContentProps {
  flowState: {
    nodes: FlowNodeWithData[];
    edges: Edge[];
    setNodes: (nodes: FlowNodeWithData[]) => void;
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (connection: any) => void;
  };
  showScript: boolean;
  setShowScript: (show: boolean) => void;
  showBrowserDialog: boolean;
  setShowBrowserDialog: (show: boolean) => void;
  isForRecording: boolean;
  selectedBrowser: any;
  onBrowserConfirm: () => void;
}

const CanvasContent = ({
  flowState,
  showScript,
  setShowScript,
  showBrowserDialog,
  setShowBrowserDialog,
  isForRecording,
  selectedBrowser,
  onBrowserConfirm
}: CanvasContentProps) => {
  const { handleDragOver, handleDrop } = useDragAndDrop(
    flowState.nodes,
    flowState.setNodes
  );
  const reactFlowInstance = useReactFlow();

  const handleGroupSelectedNodes = () => {
    const selectedNodes = reactFlowInstance.getNodes().filter(node => node.selected);
    
    if (selectedNodes.length < 2) {
      toast.error("Please select at least 2 nodes to group");
      return;
    }

    const boundingBox = selectedNodes.reduce((bounds, node) => {
      const nodeLeft = node.position.x;
      const nodeRight = node.position.x + (node.width || 0);
      const nodeTop = node.position.y;
      const nodeBottom = node.position.y + (node.height || 0);

      return {
        left: Math.min(bounds.left, nodeLeft),
        right: Math.max(bounds.right, nodeRight),
        top: Math.min(bounds.top, nodeTop),
        bottom: Math.max(bounds.bottom, nodeBottom),
      };
    }, { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity });

    const groupNode: FlowNodeWithData = {
      id: `group-${Date.now()}`,
      type: 'group',
      position: { x: boundingBox.left - 20, y: boundingBox.top - 20 },
      style: {
        width: boundingBox.right - boundingBox.left + 40,
        height: boundingBox.bottom - boundingBox.top + 40,
        background: 'rgba(207, 182, 255, 0.2)',
        borderRadius: '8px',
        padding: '20px'
      },
      data: { label: 'New Group' }
    };

    const updatedNodes = flowState.nodes.map(node => {
      if (selectedNodes.find(n => n.id === node.id)) {
        return {
          ...node,
          parentNode: groupNode.id,
          extent: 'parent' as const
        };
      }
      return node;
    });

    flowState.setNodes([...updatedNodes, groupNode]);
    toast.success("Nodes grouped successfully");
  };

  return (
    <>
      <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
        <Button
          onClick={handleGroupSelectedNodes}
          className="flex items-center gap-2 bg-gradient-to-br from-[#9E86ED] to-[#7C3AED] text-white"
        >
          <GroupIcon className="h-4 w-4" />
          <span>Group Selected</span>
        </Button>
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
        <WorkflowRunDialog
          showBrowserDialog={showBrowserDialog}
          setShowBrowserDialog={setShowBrowserDialog}
          onConfirm={onBrowserConfirm}
          isForRecording={isForRecording}
        />
      </FlowLayout>
    </>
  );
};

const Canvas = () => {
  const [showScript, setShowScript] = useState(false);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [isForRecording, setIsForRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const {
    startRecording,
    stopRecording,
    selectedBrowser,
    startWorkflow
  } = useServerState();

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

        await startWorkflow([], [], executionParams);
        toast.success("Workflow started successfully");
      }
      setShowBrowserDialog(false);
    } catch (error) {
      console.error("Error in browser confirmation:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="w-full h-screen bg-background">
      <ReactFlowProvider>
        <WorkflowStateProvider>
          {(flowState) => (
            <CanvasContent
              flowState={flowState}
              showScript={showScript}
              setShowScript={setShowScript}
              showBrowserDialog={showBrowserDialog}
              setShowBrowserDialog={setShowBrowserDialog}
              isForRecording={isForRecording}
              selectedBrowser={selectedBrowser}
              onBrowserConfirm={handleBrowserConfirm}
            />
          )}
        </WorkflowStateProvider>
      </ReactFlowProvider>
    </div>
  );
};

export default Canvas;
