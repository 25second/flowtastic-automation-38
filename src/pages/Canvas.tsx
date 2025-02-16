
import { WorkflowStateProvider } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useState } from "react";
import { FlowNodeWithData } from "@/types/flow";
import { Edge, ReactFlowProvider } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { ScriptDialog } from "@/components/flow/ScriptDialog";
import '@xyflow/react/dist/style.css';

const CanvasContent = () => {
  const [showScript, setShowScript] = useState(false);

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
              <div className="absolute top-4 right-4">
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
