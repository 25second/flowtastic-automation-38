
import { ReactFlow, SelectionMode, useReactFlow, Node, Edge } from '@xyflow/react';
import { Edge as FlowEdge, ConnectionMode, Connection } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { nodeTypes } from '../flow/CustomNode';
import { FlowControls } from './FlowControls';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Trash2, ClipboardPaste } from "lucide-react";
import { useCallback } from 'react';
import { toast } from "sonner";

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
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();

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

  const handleConnect = (params: Connection) => {
    if (!params.sourceHandle || !params.targetHandle) {
      return;
    }

    if (params.source === params.target) {
      toast.error("Нельзя соединять узел с самим собой");
      return;
    }

    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);

    if (!sourceNode || !targetNode) return;

    // Check handle positions based on source and target handles
    const isSourceOutput = sourceNode.data?.handles?.find(h => h.id === params.sourceHandle)?.type === 'source';
    const isTargetInput = targetNode.data?.handles?.find(h => h.id === params.targetHandle)?.type === 'target';

    if (isSourceOutput && !isTargetInput) {
      toast.error("Нельзя соединять два выхода");
      return;
    }

    if (!isSourceOutput && isTargetInput) {
      toast.error("Нельзя соединять два входа");
      return;
    }

    onConnect(params);
    toast.success("Узлы соединены");
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ContextMenu>
        <ContextMenuTrigger>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
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
            selectionMode={SelectionMode.Partial}
            selectionOnDrag
            selectionKeyCode="Shift"
          >
            <FlowControls />
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
