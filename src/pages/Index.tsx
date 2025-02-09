import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sidebar } from '@/components/flow/Sidebar';
import { nodeTypes } from '@/components/flow/CustomNode';
import { Button } from '@/components/ui/button';
import { useFlowState } from '@/hooks/useFlowState';
import { ScriptDialog } from '@/components/flow/ScriptDialog';
import { toast } from 'sonner';
import { Sparkles, Play, Server } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [showServerDialog, setShowServerDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [servers, setServers] = useState<Array<{id: string, url: string}>>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [newServerUrl, setNewServerUrl] = useState('');

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

  const registerServer = async () => {
    if (!newServerUrl) {
      toast.error('Please enter a server URL');
      return;
    }

    try {
      const response = await fetch(`${newServerUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to register server');
      
      const { serverId } = await response.json();
      setServers(prev => [...prev, { id: serverId, url: newServerUrl }]);
      toast.success('Server registered successfully');
      setNewServerUrl('');
    } catch (error) {
      console.error('Server registration error:', error);
      toast.error('Failed to register server');
    }
  };

  const startWorkflow = async () => {
    if (!selectedServer) {
      toast.error('Please select a server to execute the workflow');
      return;
    }

    const server = servers.find(s => s.id === selectedServer);
    if (!server) {
      toast.error('Selected server not found');
      return;
    }

    try {
      toast.promise(
        fetch(`${server.url}/execute-workflow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes, edges })
        })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to execute workflow');
          const data = await res.json();
          console.log('Workflow execution response:', data);
        }),
        {
          loading: 'Executing workflow...',
          success: 'Workflow completed successfully!',
          error: 'Failed to execute workflow'
        }
      );
    } catch (error) {
      console.error('Workflow execution error:', error);
      toast.error('Failed to execute workflow');
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar onDragStart={onDragStart} />
      <div className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Select value={selectedServer} onValueChange={setSelectedServer}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select server" />
            </SelectTrigger>
            <SelectContent>
              {servers.map(server => (
                <SelectItem key={server.id} value={server.id}>
                  {server.url}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setShowServerDialog(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Server className="h-4 w-4" />
            Add Server
          </Button>
          <Button 
            onClick={startWorkflow}
            className="bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)] flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Start Workflow
          </Button>
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

      <Dialog open={showServerDialog} onOpenChange={setShowServerDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Automation Server</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter server URL (e.g., http://192.168.1.100:3001)"
                value={newServerUrl}
                onChange={(e) => setNewServerUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    registerServer();
                  }
                }}
              />
            </div>
            <Button onClick={registerServer}>Add Server</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
