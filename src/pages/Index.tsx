
import '@xyflow/react/dist/style.css';
import { useFlowState } from '@/hooks/useFlowState';
import { useServerState } from '@/hooks/useServerState';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { useFlowActions } from '@/hooks/useFlowActions';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Toolbar } from '@/components/flow/Toolbar';
import { DialogManager } from '@/components/flow/DialogManager';
import { WorkflowProvider } from '@/components/flow/WorkflowProvider';

const Index = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
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
    saveWorkflow.mutate({ nodes, edges });
  };

  return (
    <WorkflowProvider
      nodes={nodes}
      edges={edges}
      setNodes={setNodes}
      setEdges={setEdges}
    >
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

        <DialogManager
          nodes={nodes}
          edges={edges}
          showAIDialog={showAIDialog}
          setShowAIDialog={setShowAIDialog}
          prompt={prompt}
          setPrompt={setPrompt}
          setNodes={setNodes}
          setEdges={setEdges}
          showServerDialog={showServerDialog}
          setShowServerDialog={setShowServerDialog}
          serverToken={serverToken}
          setServerToken={setServerToken}
          registerServer={registerServer}
          showSaveDialog={showSaveDialog}
          setShowSaveDialog={setShowSaveDialog}
          workflowName={workflowName}
          workflowDescription={workflowDescription}
          onNameChange={setWorkflowName}
          onDescriptionChange={setWorkflowDescription}
          onSave={handleSave}
          tags={tags}
          onTagsChange={setTags}
          category=""
          onCategoryChange={() => {}}
          categories={['Development', 'Testing', 'Production']}
          showBrowserDialog={showBrowserDialog}
          setShowBrowserDialog={setShowBrowserDialog}
          showRecordDialog={showRecordDialog}
          setShowRecordDialog={setShowRecordDialog}
          handleStartWorkflow={handleStartWorkflow}
          handleRecordClick={handleRecordClick}
        />
      </FlowLayout>
    </WorkflowProvider>
  );
};

export default Index;
