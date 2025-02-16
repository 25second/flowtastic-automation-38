
import { WorkflowStateProvider } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useState } from "react";
import { FlowNodeWithData } from "@/types/flow";
import { Edge } from "@xyflow/react";

const Canvas = () => {
  const [nodes, setNodes] = useState<FlowNodeWithData[]>([]);
  const { handleDragOver, handleDrop } = useDragAndDrop(nodes, setNodes);

  return (
    <WorkflowStateProvider>
      {(flowState) => (
        <FlowLayout
          nodes={flowState.nodes}
          edges={flowState.edges}
          onNodesChange={flowState.onNodesChange}
          onEdgesChange={flowState.onEdgesChange}
          onConnect={flowState.onConnect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="h-full w-full" />
        </FlowLayout>
      )}
    </WorkflowStateProvider>
  );
};

export default Canvas;
