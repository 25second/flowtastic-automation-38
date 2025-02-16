
import { WorkflowStateProvider } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

const Canvas = () => {
  const { onDragOver, onDrop } = useDragAndDrop();

  return (
    <WorkflowStateProvider>
      {(flowState) => (
        <FlowLayout
          nodes={flowState.nodes}
          edges={flowState.edges}
          onNodesChange={flowState.onNodesChange}
          onEdgesChange={flowState.onEdgesChange}
          onConnect={flowState.onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {/* Additional controls and dialogs can be added here */}
        </FlowLayout>
      )}
    </WorkflowStateProvider>
  );
};

export default Canvas;
