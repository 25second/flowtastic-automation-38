
import { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';

export const useFlowActions = (
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
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

    const newNode = {
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

    setNodes((nds) => nds.concat(newNode));
    toast.success('Node added');
  };

  const handleStartWorkflow = async (selectedBrowser: number | null) => {
    if (selectedBrowser !== null) {
      await startWorkflow(nodes, edges, selectedBrowser);
      setShowBrowserDialog(false);
    }
  };

  const handleRecordClick = async () => {
    if (isRecording) {
      const recordedNodes = await stopRecording();
      if (recordedNodes) {
        setNodes(prev => [...prev, ...recordedNodes]);
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
