
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { BackButton } from './BackButton';
import { Sidebar } from './Sidebar';
import { FlowCanvas } from './FlowCanvas';

interface FlowLayoutProps {
  nodes: FlowNodeWithData[];
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
  return (
    <div className="flex h-screen w-full">
      <BackButton />
      <Sidebar onDragStart={(event, nodeType, nodeLabel, settings, description) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ 
          type: nodeType, 
          label: nodeLabel,
          settings: settings,
          description: description
        }));
        event.dataTransfer.effectAllowed = 'move';
      }} />
      <div className="flex-1 h-full relative" onDragOver={onDragOver} onDrop={onDrop}>
        {children}
        <div className="absolute inset-0">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          />
        </div>
      </div>
    </div>
  );
};
