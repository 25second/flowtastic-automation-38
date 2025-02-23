
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
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
            onNodesChange={(changes) => {
              setNodes((nds) =>
                nds.map((node) => {
                  const change = changes.find((c) => c.id === node.id);
                  if (change) {
                    return { ...node, ...change };
                  }
                  return node;
                })
              );
            }}
            onEdgesChange={(changes) => {
              setEdges((eds) =>
                eds.map((edge) => {
                  const change = changes.find((c) => c.id === edge.id);
                  if (change) {
                    return { ...edge, ...change };
                  }
                  return edge;
                })
              );
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
