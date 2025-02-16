
import { WorkflowStateProvider } from "@/components/flow/WorkflowStateProvider";
import { FlowLayout } from "@/components/flow/FlowLayout";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useState } from "react";
import { FlowNodeWithData } from "@/types/flow";
import { Edge, ReactFlowProvider } from "@xyflow/react";
import { Toolbar } from "@/components/flow/Toolbar";
import '@xyflow/react/dist/style.css';

const Canvas = () => {
  const [nodes, setNodes] = useState<FlowNodeWithData[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const { handleDragOver, handleDrop } = useDragAndDrop(nodes, setNodes);

  const handleStartWorkflow = () => {
    console.log("Start workflow clicked");
  };

  const handleCreateWithAI = () => {
    console.log("Create with AI clicked");
  };

  const handleSave = () => {
    console.log("Save clicked");
  };

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
    console.log("Record clicked, new state:", !isRecording);
  };

  return (
    <div className="w-full h-screen bg-background">
      <ReactFlowProvider>
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
              <div className="h-full w-full relative">
                <Toolbar 
                  browsers={[]}
                  selectedBrowser={null}
                  onBrowserSelect={() => {}}
                  onStartWorkflow={handleStartWorkflow}
                  onCreateWithAI={handleCreateWithAI}
                  onSave={handleSave}
                  isRecording={isRecording}
                  onRecordClick={handleRecordClick}
                />
              </div>
            </FlowLayout>
          )}
        </WorkflowStateProvider>
      </ReactFlowProvider>
    </div>
  );
};

export default Canvas;
