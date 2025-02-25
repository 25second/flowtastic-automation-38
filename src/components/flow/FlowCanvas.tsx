
import { ReactFlow, SelectionMode, useReactFlow, Node, Edge } from '@xyflow/react';
import { Edge as FlowEdge, ConnectionMode, Panel } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { nodeTypes } from '../flow/CustomNode';
import { FlowControls } from './FlowControls';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Trash2, ClipboardPaste, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useCallback } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface FlowCanvasProps {
  nodes: FlowNodeWithData[];
  edges: FlowEdge[];
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
  const { getNodes, setNodes, getEdges, setEdges, zoomIn, zoomOut, fitView } = useReactFlow();

  const onCopy = useCallback(() => {
    const selectedNodes = getNodes().filter(node => node.selected);
    const selectedEdges = getEdges().filter(edge => edge.selected);
    
    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      toast.warning("Ничего не выбрано для копирования");
      return;
    }

    localStorage.setItem('flowClipboard', JSON.stringify({
      nodes: selectedNodes,
      edges: selectedEdges
    }));
    toast.success("Скопировано");
  }, [getNodes, getEdges]);

  const onPaste = useCallback(() => {
    const clipboardData = localStorage.getItem('flowClipboard');
    if (!clipboardData) {
      toast.warning("Буфер обмена пуст");
      return;
    }

    try {
      const { nodes: clipboardNodes, edges: clipboardEdges } = JSON.parse(clipboardData);
      
      const newNodes = clipboardNodes.map((node: Node) => ({
        ...node,
        id: `${node.id}-copy-${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50
        },
        selected: false
      }));

      const newEdges = clipboardEdges.map((edge: Edge) => ({
        ...edge,
        id: `${edge.id}-copy-${Date.now()}`,
        source: `${edge.source}-copy-${Date.now()}`,
        target: `${edge.target}-copy-${Date.now()}`,
        selected: false
      }));

      setNodes(nodes => [...nodes, ...newNodes]);
      setEdges(edges => [...edges, ...newEdges]);
      toast.success("Вставлено");
    } catch (error) {
      console.error('Error pasting nodes:', error);
      toast.error("Ошибка при вставке");
    }
  }, [setNodes, setEdges]);

  const onDelete = useCallback(() => {
    const selectedNodes = getNodes().filter(node => node.selected);
    const selectedEdges = getEdges().filter(edge => edge.selected);
    
    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      toast.warning("Ничего не выбрано для удаления");
      return;
    }

    setNodes(nodes => nodes.filter(node => !node.selected));
    setEdges(edges => edges.filter(edge => !edge.selected));
    toast.success("Удалено");
  }, [getNodes, getEdges, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ContextMenu>
        <ContextMenuTrigger>
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
            connectionMode={ConnectionMode.Loose}
            className="react-flow-connection-test"
            deleteKeyCode={['Backspace', 'Delete']}
            selectionMode={SelectionMode.Partial}
            selectionOnDrag
            selectionKeyCode="Shift"
            multiSelectionKeyCode="Control"
            zoomOnScroll
            zoomOnPinch
            panOnScroll
            panOnDrag={[1, 2]}
            elevateNodesOnSelect
            connectOnClick={false}
            connectionRadius={30}
          >
            <FlowControls />
            <Panel position="top-right" className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => zoomIn()}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => zoomOut()}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => fitView()}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </Panel>
          </ReactFlow>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={onCopy} className="gap-2">
            <Copy className="h-4 w-4" />
            <span>Копировать</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={onPaste} className="gap-2">
            <ClipboardPaste className="h-4 w-4" />
            <span>Вставить</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={onDelete} className="gap-2 text-red-600">
            <Trash2 className="h-4 w-4" />
            <span>Удалить</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
