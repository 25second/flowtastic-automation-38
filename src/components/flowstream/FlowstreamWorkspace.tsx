
import { ReactFlow, Background, Controls, MiniMap, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { FlowstreamSidebar } from './FlowstreamSidebar';
import { FlowstreamToolbar } from './FlowstreamToolbar';
import { useFlowstream } from './FlowstreamProvider';
import { CustomNode, nodeTypes } from '../flow/CustomNode';

export function FlowstreamWorkspace() {
  const { nodes, edges, setNodes, setEdges } = useFlowstream();

  return (
    <div className="flex-1 flex">
      <FlowstreamSidebar />
      <div className="flex-1 flex flex-col">
        <FlowstreamToolbar />
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={(changes: NodeChange[]) => {
              setNodes((nds) => applyNodeChanges(changes, nds));
            }}
            onEdgesChange={(changes: EdgeChange[]) => {
              setEdges((eds) => applyEdgeChanges(changes, eds));
            }}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
