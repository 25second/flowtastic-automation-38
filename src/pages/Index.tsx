
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlowState } from '@/hooks/useFlowState';
import { useServerState } from '@/hooks/useServerState';
import { useFlowActions } from '@/hooks/useFlowActions';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { useWorkflowHandlers } from '@/hooks/useWorkflowHandlers';
import { FlowContainer } from '@/components/flow/FlowContainer';

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
    prompt,
    setPrompt,
    isRecording,
    handleDragOver,
    handleDrop,
    handleStartWorkflow,
    handleRecordClick,
  } = useFlowActions(nodes, setNodes, edges, startWorkflow, startRecording, stopRecording);

  const {
    showBrowserDialog,
    setShowBrowserDialog,
    handleStartWithDialog,
    handleRecordWithDialog,
    handleConfirmAction,
  } = useWorkflowHandlers(nodes, edges, handleStartWorkflow, handleRecordClick);

  useEffect(() => {
    if (existingWorkflow) {
      setNodes(existingWorkflow.nodes || []);
      setEdges(existingWorkflow.edges || []);
      setWorkflowName(existingWorkflow.name || '');
      setWorkflowDescription(existingWorkflow.description || '');
      setTags(existingWorkflow.tags || []);
    } else {
      resetFlow();
    }
  }, [existingWorkflow, setNodes, setEdges, setWorkflowName, setWorkflowDescription, setTags, resetFlow]);

  const handleSave = () => {
    if (existingWorkflow) {
      saveWorkflow.mutate({ id: existingWorkflow.id, nodes, edges });
    } else {
      setShowSaveDialog(true);
    }
  };

  return (
    <FlowContainer
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      browsers={browsers}
      selectedBrowser={selectedBrowser}
      onBrowserSelect={setSelectedBrowser}
      onStartWorkflow={handleStartWorkflow}
      onCreateWithAI={() => setShowAIDialog(true)}
      onSave={handleSave}
      isRecording={isRecording}
      onRecordClick={handleRecordClick}
      onStartWithDialog={handleStartWithDialog}
      onRecordWithDialog={handleRecordWithDialog}
      showSaveDialog={showSaveDialog}
      setShowSaveDialog={setShowSaveDialog}
      workflowName={workflowName}
      workflowDescription={workflowDescription}
      onNameChange={setWorkflowName}
      onDescriptionChange={setWorkflowDescription}
      onSaveWorkflow={() => saveWorkflow.mutate({ nodes, edges })}
      tags={tags}
      onTagsChange={setTags}
      showAIDialog={showAIDialog}
      setShowAIDialog={setShowAIDialog}
      prompt={prompt}
      setPrompt={setPrompt}
      showServerDialog={showServerDialog}
      setShowServerDialog={setShowServerDialog}
      serverToken={serverToken}
      setServerToken={setServerToken}
      onRegisterServer={registerServer}
      showBrowserDialog={showBrowserDialog}
      setShowBrowserDialog={setShowBrowserDialog}
      selectedServer={selectedServer}
      onServerSelect={setSelectedServer}
      onConfirmAction={handleConfirmAction}
      servers={servers}
    />
  );
};

export default Index;
