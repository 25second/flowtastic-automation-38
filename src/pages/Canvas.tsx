import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  ReactFlowInstance,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { initialNodes, initialEdges } from '@/components/flow/initial-elements';
import { CustomNode } from '@/components/flow/node-components/CustomNode';
import { FloatingEdge } from '@/components/flow/edges/FloatingEdge';
import { HandleType } from '@xyflow/react/dist/types';
import { CustomConnectionLine } from '@/components/flow/connection-line/CustomConnectionLine';
import { useTranslation } from 'react-i18next';
import { Sidebar } from '@/components/flow/sidebar/Sidebar';
import { MiniMapNode } from '@/components/flow/node-components/MiniMapNode';

const nodeTypes = {
  custom: CustomNode,
  miniMapNode: MiniMapNode
};

const edgeTypes = {
  floating: FloatingEdge,
};

const snapGrid = [20, 20];

export default function Canvas() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { t } = useTranslation();
  const [accentColor, setAccentColor] = useState('#9b87f5');
  
  useEffect(() => {
    const savedAccentColor = localStorage.getItem('accentColor');
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
    }
  }, []);

  // Create a slightly darker shade for the gradient
  const getDarkerShade = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const darkerR = Math.floor(r * 0.8);
    const darkerG = Math.floor(g * 0.8);
    const darkerB = Math.floor(b * 0.8);
    
    return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
  };

  const buttonStyle = {
    background: `linear-gradient(to bottom right, ${accentColor}, ${getDarkerShade(accentColor)})`,
    ':hover': {
      background: `linear-gradient(to bottom right, ${getDarkerShade(accentColor)}, ${getDarkerShade(getDarkerShade(accentColor))})`
    }
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      const isExistingConnection = edges.some(
        (edge) => edge.source === params.source && edge.target === params.target
      );

      if (isExistingConnection) {
        return;
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, edges]
  );

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const reactFlowBounds = document
        .querySelector('.react-flow-wrapper')
        ?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const type = event.dataTransfer.getData('application/reactflow');
      const name = event.dataTransfer.getData('name');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = rfInstance!.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: name + '-' + Date.now(),
        type,
        position,
        data: { label: name },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const defaultEdgeOptions = {
    animated: true,
    type: 'floating',
    style: {
      stroke: accentColor,
    },
  };

  const isValidConnection = (connection: any) => {
    const { source, target, sourceHandle, targetHandle } = connection;

    if (!source || !target || !sourceHandle || !targetHandle) {
      return false;
    }

    const sourceNode = nodes.find((node) => node.id === source);
    const targetNode = nodes.find((node) => node.id === target);

    if (!sourceNode || !targetNode) {
      return false;
    }

    const sourceType = sourceNode.type;
    const targetType = targetNode.type;

    if (sourceType === 'output' && targetType === 'input') {
      return false;
    }

    if (sourceType === 'custom' && targetType === 'custom') {
      return true;
    }

    if (sourceHandle.startsWith('input-')) {
      return true;
    }

    return false;
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          snapToGrid={true}
          snapGrid={snapGrid}
          connectionLineComponent={CustomConnectionLine}
          onDrop={onDrop}
          onDragOver={onDragOver}
          isValidConnection={isValidConnection}
          fitView
        >
          <MiniMap nodeColor={(node: Node) => {
            if (node.type === 'input') return '#6ede87';
            if (node.type === 'output') return '#6edede';
            if (node.type === 'default') return '#ffc698';
            return '#ffab00';
          }}
          />
          <Controls />
          <Background color="#aaa" variant="dots" gap={16} size={1} />
        </ReactFlow>
        <button
        style={buttonStyle}
        className="flex items-center gap-2 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 animate-fade-in group"
      >
        {t('new_workflow')}
      </button>
      </div>
    </div>
  );
}
