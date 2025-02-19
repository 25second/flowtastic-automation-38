
import { ReactFlow, Edge, Panel, SelectionMode } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { nodeTypes } from './CustomNode';
import { FlowControls } from './FlowControls';
import { useCallback } from 'react';
import { MouseEvent } from 'react';

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
  const onSelectionStart = useCallback((event: MouseEvent<Element>) => {
    console.log('Selection started:', event);
  }, []);

  const onSelectionEnd = useCallback((event: MouseEvent<Element>) => {
    console.log('Selection ended:', event);
  }, []);

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
        connectOnClick={true}
        onSelectionStart={onSelectionStart}
        onSelectionEnd={onSelectionEnd}
        selectionOnDrag={true}
        selectionMode={SelectionMode.Partial}
        panOnDrag={[1, 2]}
        selectNodesOnDrag={true}
      >
        <FlowControls />
      </ReactFlow>
    </div>
  );
};
