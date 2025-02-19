
import { ReactFlow } from '@xyflow/react';
import { Edge, SelectionMode } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { nodeTypes } from './CustomNode';
import { FlowControls } from './FlowControls';
import { useCallback, useState, useEffect } from 'react';

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
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // Handle keyboard events for shift key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const onSelectionStart = useCallback((event: React.MouseEvent) => {
    if (!isShiftPressed) {
      event.preventDefault();
    }
  }, [isShiftPressed]);

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
        selectionMode={SelectionMode.Partial}
        selectionOnDrag={isShiftPressed}
        multiSelectionKeyCode="Shift"
        onSelectionStart={onSelectionStart}
        panOnDrag={[1]}
        selectNodesOnDrag={false}
      >
        <FlowControls />
      </ReactFlow>
    </div>
  );
};
