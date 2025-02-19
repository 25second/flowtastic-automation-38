
import { ReactFlow, Edge, Panel, SelectionMode } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { nodeTypes } from './CustomNode';
import { FlowControls } from './FlowControls';
import { useCallback, useState, useEffect } from 'react';
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
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const onSelectionStart = useCallback((event: MouseEvent<Element>) => {
    if (!isShiftPressed) {
      event.preventDefault();
      return;
    }
    console.log('Selection started:', event);
  }, [isShiftPressed]);

  const onSelectionEnd = useCallback((event: MouseEvent<Element>) => {
    if (!isShiftPressed) {
      event.preventDefault();
      return;
    }
    console.log('Selection ended:', event);
  }, [isShiftPressed]);

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey) setIsShiftPressed(true);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.shiftKey) setIsShiftPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
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
        selectionOnDrag={isShiftPressed}
        selectionMode={SelectionMode.Partial}
        panOnDrag={[1, 2]}
        selectNodesOnDrag={isShiftPressed}
        draggable={true}  // Enable node dragging
        nodeDragThreshold={1}  // Makes dragging more responsive
        nodesFocusable={true}  // Allows nodes to be focused
        nodesConnectable={true}  // Allows nodes to be connected
        elementsSelectable={true}  // Allows elements to be selected
      >
        <FlowControls />
      </ReactFlow>
    </div>
  );
};
