
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
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Copy, Trash2, ClipboardPaste, StickyNote } from "lucide-react";
import { useCallback, useState } from 'react';
import { toast } from "sonner";

interface Handle {
  id: string;
  type: 'source' | 'target';
}

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
  const { getNodes, setNodes, getEdges, setEdges, screenToFlowPosition } = useReactFlow();
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

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

    const sourceHandles = (sourceNode.data?.handles || []) as Handle[];
    const targetHandles = (targetNode.data?.handles || []) as Handle[];

    const isSourceOutput = sourceHandles.some(h => h.id === params.sourceHandle && h.type === 'source');
    const isTargetInput = targetHandles.some(h => h.id === params.targetHandle && h.type === 'target');

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

  const handlePaneContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    setContextMenuPosition(position);
  };

  const addNote = () => {
    const newNode: FlowNodeWithData = {
      id: `note-${Date.now()}`,
      type: 'noteNode',
      position: contextMenuPosition,
      data: {
        type: 'noteNode',
        label: 'Новая заметка',
        content: '',
        color: 'bg-yellow-100'
      },
    };
    setNodes(nodes => [...nodes, newNode]);
    toast.success("Заметка добавлена");
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
            onPaneContextMenu={handlePaneContextMenu}
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
          <ContextMenuItem onClick={addNote} className="gap-2">
            <StickyNote className="h-4 w-4" />
            <span>Добавить заметку</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
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
