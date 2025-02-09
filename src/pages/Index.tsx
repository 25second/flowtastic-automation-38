
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
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
    isRecording,
    startRecording,
    stopRecording,
  } = useServerState();

  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showBrowserDialog, setShowBrowserDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  const queryClient = useQueryClient();

  // Fetch workflows
  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Save workflow mutation
  const saveWorkflow = useMutation({
    mutationFn: async () => {
      if (!workflowName) {
        toast.error('Please enter a workflow name');
        return;
      }

      const { data, error } = await supabase
        .from('workflows')
        .insert({
          name: workflowName,
          description: workflowDescription,
          nodes: nodes,
          edges: edges,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Workflow saved successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setWorkflowName('');
      setWorkflowDescription('');
    },
    onError: (error) => {
      toast.error('Failed to save workflow');
      console.error('Save error:', error);
    },
  });

  // Delete workflow mutation
  const deleteWorkflow = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Workflow deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: (error) => {
      toast.error('Failed to delete workflow');
      console.error('Delete error:', error);
    },
  });

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

  const handleRecordClick = async () => {
    if (isRecording) {
      const recordedNodes = await stopRecording();
      if (recordedNodes) {
        setNodes(prev => [...prev, ...recordedNodes]);
        toast.success('Recording added to workflow');
      }
    } else {
      startRecording();
    }
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
          isRecording={isRecording}
          onRecordClick={handleRecordClick}
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

        {/* Workflow Management UI */}
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Workflow name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={() => saveWorkflow.mutate()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Workflow
            </button>
          </div>

          {/* Workflows List */}
          <div className="max-h-40 overflow-y-auto">
            {isLoading ? (
              <p>Loading workflows...</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {workflows?.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="p-3 border rounded flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{workflow.name}</h3>
                      {workflow.description && (
                        <p className="text-sm text-gray-600">{workflow.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteWorkflow.mutate(workflow.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
