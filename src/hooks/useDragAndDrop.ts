
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

    try {
      const dataTransferData = event.dataTransfer.getData('application/reactflow');
      
      if (!dataTransferData) {
        toast.error('No valid data found in drag event');
        return;
      }

      const data = JSON.parse(dataTransferData);
      
      if (!data || !data.type) {
        toast.error('Invalid node data format');
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
          label: data.label || 'New Node',
          settings: { ...(data.settings || {}) },
          description: data.description || ''
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
    } catch (error) {
      console.error('Error processing drag and drop:', error);
      toast.error('Failed to process dragged node');
    }
  };

  return {
    handleDragOver,
    handleDrop,
  };
};
