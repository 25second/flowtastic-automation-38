
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sidebar } from '@/components/flow/Sidebar';
import { nodeTypes } from '@/components/flow/CustomNode';
import { useFlowState } from '@/hooks/useFlowState';
import { ScriptDialog } from '@/components/flow/ScriptDialog';
import { useState } from 'react';
import { AIDialog } from '@/components/flow/AIDialog';
import { ServerDialog } from '@/components/flow/ServerDialog';
import { Toolbar } from '@/components/flow/Toolbar';
import { useServerState } from '@/hooks/useServerState';
import { BrowserSelectDialog } from '@/components/flow/BrowserSelectDialog';
import { toast } from 'sonner';

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

  const {
    servers,
    selectedServer,
    setSelectedServer,
    serverToken,
    setServerToken,
    showServerDialog,
    setShowServerDialog,
    registerServer,
    startWorkflow,
    browsers,
    selectedBrowser,
    setSelectedBrowser,
  } = useServerState();

  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
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

  const handleStartWorkflow = (selectedPorts: number[]) => {
    Promise.all(selectedPorts.map(port => startWorkflow(nodes, edges, port)));
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar onDragStart={onDragStart} />
      <div className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
        <Toolbar 
          servers={servers}
          selectedServer={selectedServer}
          onServerSelect={setSelectedServer}
          onAddServerClick={() => setShowServerDialog(true)}
          onStartWorkflow={() => setShowBrowserDialog(true)}
          onCreateWithAI={() => setShowAIDialog(true)}
          onViewScript={() => setShowScript(true)}
          browsers={browsers}
          selectedBrowser={selectedBrowser}
          onBrowserSelect={setSelectedBrowser}
        />
        
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

      <AIDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        prompt={prompt}
        setPrompt={setPrompt}
      />

      <ServerDialog
        open={showServerDialog}
        onOpenChange={setShowServerDialog}
        serverToken={serverToken}
        setServerToken={setServerToken}
        onRegister={registerServer}
      />

      <BrowserSelectDialog
        open={showBrowserDialog}
        onOpenChange={setShowBrowserDialog}
        browsers={browsers}
        onConfirm={handleStartWorkflow}
      />
    </div>
  );
};

export default Index;
