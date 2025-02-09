
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import { nodeTypes } from './CustomNode';
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';

interface FlowLayoutProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  children: React.ReactNode;
}

export const FlowLayout = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDragOver,
  onDrop,
  children
}: FlowLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <Sidebar onDragStart={(event, nodeType, nodeLabel, settings, description) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ 
          type: nodeType, 
          label: nodeLabel,
          settings: settings,
          description: description
        }));
        event.dataTransfer.effectAllowed = 'move';
      }} />
      <div className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
        {children}
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
        >
          <Background gap={15} size={1} />
          <Controls />
          <MiniMap 
            nodeColor={() => '#fff'}
            maskColor="rgb(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>
    </div>
  );
};
