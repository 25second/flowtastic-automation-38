
import { useLocation } from 'react-router-dom';
import { useFlowActions } from '@/hooks/useFlowActions';
import { useServerState } from '@/hooks/useServerState';
import { useWorkflowState } from '@/hooks/useWorkflowState';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { Toolbar } from '@/components/flow/Toolbar';
import { WorkflowDialogs } from '@/components/flow/WorkflowDialogs';

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
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow,
  } = useWorkflowState(existingWorkflow);

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
    startRecording,
    stopRecording,
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

      <WorkflowDialogs
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
        showRecordDialog={showRecordDialog}
        setShowRecordDialog={setShowRecordDialog}
        servers={servers}
        selectedServer={selectedServer}
        onServerSelect={setSelectedServer}
        browsers={browsers}
        selectedBrowser={selectedBrowser}
        onBrowserSelect={setSelectedBrowser}
        onStartWorkflow={handleStartWorkflow}
        onRecordWorkflow={handleRecordClick}
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onWorkflowNameChange={setWorkflowName}
        onWorkflowDescriptionChange={setWorkflowDescription}
        onSaveWorkflow={() => saveWorkflow.mutate({ nodes, edges })}
        tags={tags}
        onTagsChange={setTags}
      />
    </FlowLayout>
  );
};

export default Index;

