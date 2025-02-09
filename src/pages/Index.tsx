
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sidebar } from '@/components/flow/Sidebar';
import { nodeTypes } from '@/components/flow/CustomNode';
import { Button } from '@/components/ui/button';
import { useFlowState } from '@/hooks/useFlowState';
import { ScriptDialog } from '@/components/flow/ScriptDialog';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const Index = () => {
  const {
    nodes,
    edges,
    setNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    showScript,
    setShowScript,
  } = useFlowState();

  const [showAIDialog, setShowAIDialog] = useState(false);
  const [prompt, setPrompt] = useState('');

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string, settings: any, description: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ 
      type: nodeType, 
      label: nodeLabel,
      settings: settings,
      description: description
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
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

  const handleAICreate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      toast.promise(
        fetch('/api/generate-with-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to generate flow');
          const data = await res.json();
          // Here you would process the AI response and create nodes
          toast.success('Flow generated successfully!');
          setShowAIDialog(false);
          setPrompt('');
        }),
        {
          loading: 'Generating flow...',
          success: 'Flow generated successfully!',
          error: 'Failed to generate flow'
        }
      );
    } catch (error) {
      toast.error('Failed to generate flow');
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar onDragStart={onDragStart} />
      <div className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button 
            onClick={() => setShowAIDialog(true)}
            className="bg-[#9b87f5] hover:bg-[#8B5CF6] transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_20px_rgba(139,92,246,0.7)] flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Create with AI ✨
          </Button>
          <Button 
            onClick={() => setShowScript(true)}
            variant="secondary"
          >
            View Script
          </Button>
        </div>
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

      <ScriptDialog
        open={showScript}
        onOpenChange={setShowScript}
        nodes={nodes}
        edges={edges}
      />

      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Flow with AI</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Describe the flow you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAICreate();
                  }
                }}
              />
            </div>
            <Button onClick={handleAICreate}>Generate</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
