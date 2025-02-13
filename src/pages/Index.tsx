
import '@xyflow/react/dist/style.css';
import { AIDialog } from '@/components/flow/AIDialog';
import { ServerDialog } from '@/components/flow/ServerDialog';
import { Toolbar } from '@/components/flow/Toolbar';
import { useFlowState } from '@/hooks/useFlowState';
import { useServerState } from '@/hooks/useServerState';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { useFlowActions } from '@/hooks/useFlowActions';
import { SaveWorkflowDialog } from '@/components/flow/SaveWorkflowDialog';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { WorkflowRunner } from '@/components/dashboard/WorkflowRunner';
import { useLocation } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const Index = () => {
  const location = useLocation();
  const existingWorkflow = location.state?.workflow;

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    resetFlow,
  } = useFlowState();

  useEffect(() => {
    console.log('Loading workflow:', existingWorkflow);
    if (existingWorkflow) {
      setNodes(existingWorkflow.nodes || []);
      setEdges(existingWorkflow.edges || []);
    } else {
      resetFlow();
    }
  }, [existingWorkflow, setNodes, setEdges, resetFlow]);

  const {
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow,
  } = useWorkflowManager(nodes, edges);

  useEffect(() => {
    if (existingWorkflow) {
      setWorkflowName(existingWorkflow.name || '');
      setWorkflowDescription(existingWorkflow.description || '');
      setTags(existingWorkflow.tags || []);
    }
  }, [existingWorkflow, setWorkflowName, setWorkflowDescription, setTags]);

  const {
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
    startRecording,
    stopRecording,
    servers,
  } = useServerState();

  const {
    showAIDialog,
    setShowAIDialog,
    showBrowserDialog,
    setShowBrowserDialog,
    showRecordDialog,
    setShowRecordDialog,
    prompt,
    setPrompt,
    isRecording,
    handleDragOver,
    handleDrop,
    handleStartWorkflow,
    handleRecordClick,
  } = useFlowActions(nodes, setNodes, edges, startWorkflow, startRecording, stopRecording);

  const handleSave = () => {
    if (existingWorkflow) {
      saveWorkflow.mutate({ id: existingWorkflow.id, nodes, edges });
    } else {
      setShowSaveDialog(true);
    }
  };

  const handleBrowserWorkflowStart = useCallback(async () => {
    if (!selectedBrowser) {
      console.log('No browser selected, current state:', {
        selectedBrowser,
        browsers,
        selectedServer
      });
      toast.error('Please select a browser');
      return Promise.reject(new Error('No browser selected'));
    }
    
    console.log('Starting workflow with browser:', selectedBrowser);
    await handleStartWorkflow();
  }, [selectedBrowser, handleStartWorkflow]);

  const handleBrowserRecordStart = useCallback(async () => {
    if (!selectedBrowser) {
      toast.error('Please select a browser');
      return Promise.reject(new Error('No browser selected'));
    }
    await handleRecordClick();
  }, [selectedBrowser, handleRecordClick]);

  return (
    <FlowLayout
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Toolbar 
        browsers={browsers}
        selectedBrowser={selectedBrowser}
        onBrowserSelect={setSelectedBrowser}
        onStartWorkflow={() => setShowBrowserDialog(true)}
        onCreateWithAI={() => setShowAIDialog(true)}
        onSave={handleSave}
        isRecording={isRecording}
        onRecordClick={() => setShowRecordDialog(true)}
      />

      <SaveWorkflowDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onNameChange={setWorkflowName}
        onDescriptionChange={setWorkflowDescription}
        onSave={() => saveWorkflow.mutate({ nodes, edges })}
        tags={tags}
        onTagsChange={setTags}
      />

      <AIDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        prompt={prompt}
        setPrompt={setPrompt}
        setNodes={setNodes}
        setEdges={setEdges}
      />

      <ServerDialog
        open={showServerDialog}
        onOpenChange={setShowServerDialog}
        serverToken={serverToken}
        setServerToken={setServerToken}
        onRegister={registerServer}
      />

      <WorkflowRunner
        selectedWorkflow={{ nodes, edges }}
        setSelectedWorkflow={() => {}}
        showBrowserDialog={showBrowserDialog}
        setShowBrowserDialog={setShowBrowserDialog}
        onConfirm={handleBrowserWorkflowStart}
      />

      <WorkflowRunner
        selectedWorkflow={{ nodes, edges }}
        setSelectedWorkflow={() => {}}
        showBrowserDialog={showRecordDialog}
        setShowBrowserDialog={setShowRecordDialog}
        onConfirm={handleBrowserRecordStart}
      />
    </FlowLayout>
  );
};

export default Index;
