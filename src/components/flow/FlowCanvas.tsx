
import { ReactFlow } from '@xyflow/react';
import { Edge, ConnectionMode } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { nodeTypes } from '../flow/CustomNode';
import { FlowControls } from './FlowControls';

interface FlowCanvasProps {
  nodes: FlowNodeWithData[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
}

export const FlowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: FlowCanvasProps) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
          animated: true
        }}
        connectOnClick={false}
        connectionMode={ConnectionMode.Strict}
        className="react-flow-connection-test"
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <FlowControls />
      </ReactFlow>
    </div>
  );
};
