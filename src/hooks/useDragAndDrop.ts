
import { FlowNodeWithData } from '@/types/flow';
import { toast } from 'sonner';
import { useReactFlow } from '@xyflow/react';

export const useDragAndDrop = (
  nodes: FlowNodeWithData[],
  setNodes: (nodes: FlowNodeWithData[]) => void,
) => {
  const instance = useReactFlow();

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
    
    if (!reactFlowBounds) {
      toast.error('Could not find flow bounds');
      return;
    }

    const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));

    // Проверяем количество нод данного типа
    if (data.type === 'start-script' && nodes.some(node => node.type === 'start-script')) {
      toast.error('Only one Start Script node is allowed');
      return;
    }

    if (data.type === 'stop' && nodes.some(node => node.type === 'stop')) {
      toast.error('Only one Stop node is allowed');
      return;
    }

    // Get the position relative to the viewport and project it to the flow coordinates
    const position = instance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode: FlowNodeWithData = {
      id: crypto.randomUUID(),
      type: data.type,
      position,
      data: { 
        type: data.type,
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

    console.log('Adding new node:', newNode);
    setNodes([...nodes, newNode]);
    toast.success('Node added');
  };

  return {
    handleDragOver,
    handleDrop,
  };
};
