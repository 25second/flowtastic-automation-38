
import { ReactFlow, Background, Controls, MiniMap, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { FlowstreamSidebar } from './FlowstreamSidebar';
import { FlowstreamToolbar } from './FlowstreamToolbar';
import { useFlowstream } from './FlowstreamProvider';
import { CustomNode, nodeTypes } from '../flow/CustomNode';
import { FlowNodeWithData } from '@/types/flow';
import { Edge } from '@xyflow/react';

export function FlowstreamWorkspace() {
  const { nodes, edges, setNodes, setEdges } = useFlowstream();

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((nds: FlowNodeWithData[]) => applyNodeChanges(changes, nds) as FlowNodeWithData[]);
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds));
  };

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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
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
