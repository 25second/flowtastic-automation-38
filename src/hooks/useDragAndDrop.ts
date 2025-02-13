
import { FlowNodeWithData } from '@/types/flow';
import { toast } from 'sonner';

export const useDragAndDrop = (
  nodes: FlowNodeWithData[],
  setNodes: (nodes: FlowNodeWithData[]) => void,
) => {
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
    const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));

    if (!reactFlowBounds) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode: FlowNodeWithData = {
      id: crypto.randomUUID(),
      type: data.type,
      position,
      data: { 
        label: data.label,
        settings: { ...data.settings },
        description: data.description
      },
      style: {
        background: '#fff',
        padding: '15px',
        borderRadius: '8px',
        width: 180,
      },
    };

    setNodes([...nodes, newNode]);
    toast.success('Node added');
  };

  return {
    handleDragOver,
    handleDrop,
  };
};
