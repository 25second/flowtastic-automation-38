
import { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';

export const useFlowActions = (
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  edges: Edge[],
  startWorkflow: (nodes: Node[], edges: Edge[], browser: number) => Promise<void>,
  startRecording: () => void,
  stopRecording: () => Promise<Node[]>
) => {
  const [showScript, setShowScript] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);

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

    const newNode: Node = {
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

  const handleStartWorkflow = async (browserPort: number) => {
    try {
      await startWorkflow(nodes, edges, browserPort);
      setShowBrowserDialog(false);
    } catch (error) {
      console.error('Error starting workflow:', error);
      toast.error('Failed to start workflow');
    }
  };

  const handleRecordClick = async () => {
    if (isRecording) {
      const recordedNodes = await stopRecording();
      if (recordedNodes) {
        setNodes([...nodes, ...recordedNodes]);
        toast.success('Recording added to workflow');
      }
      setIsRecording(false);
    } else {
      startRecording();
      setIsRecording(true);
    }
  };

  return {
    showScript,
    setShowScript,
    showAIDialog,
    setShowAIDialog,
    showBrowserDialog,
    setShowBrowserDialog,
    prompt,
    setPrompt,
    isRecording,
    handleDragOver,
    handleDrop,
    handleStartWorkflow,
    handleRecordClick,
  };
};
