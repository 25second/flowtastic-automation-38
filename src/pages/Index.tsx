
import '@xyflow/react/dist/style.css';
import { useServerState } from '@/hooks/useServerState';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { useFlowActions } from '@/hooks/useFlowActions';
import { Toolbar } from '@/components/flow/Toolbar';
import { FlowDialogs } from '@/components/flow/FlowDialogs';
import { WorkflowStateProvider } from '@/components/flow/WorkflowStateProvider';

const Index = () => {
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
  } = useServerState();

  return (
    <WorkflowStateProvider>
      {(flowState) => {
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
        } = useFlowActions(
          flowState.nodes,
          flowState.setNodes,
          flowState.edges,
          startWorkflow,
          startRecording,
          stopRecording
        );

        const handleSave = () => {
          if (flowState.existingWorkflow) {
            flowState.saveWorkflow.mutate({
              id: flowState.existingWorkflow.id,
              nodes: flowState.nodes,
              edges: flowState.edges,
            });
          } else {
            flowState.setShowSaveDialog(true);
          }
        };

        return (
          <FlowLayout
            nodes={flowState.nodes}
            edges={flowState.edges}
            onNodesChange={flowState.onNodesChange}
            onEdgesChange={flowState.onEdgesChange}
            onConnect={flowState.onConnect}
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

            <FlowDialogs
              nodes={flowState.nodes}
              edges={flowState.edges}
              showAIDialog={showAIDialog}
              setShowAIDialog={setShowAIDialog}
              prompt={prompt}
              setPrompt={setPrompt}
              setNodes={flowState.setNodes}
              setEdges={flowState.setEdges}
              showServerDialog={showServerDialog}
              setShowServerDialog={setShowServerDialog}
              serverToken={serverToken}
              setServerToken={setServerToken}
              registerServer={registerServer}
              showSaveDialog={flowState.showSaveDialog}
              setShowSaveDialog={flowState.setShowSaveDialog}
              workflowName={flowState.workflowName}
              workflowDescription={flowState.workflowDescription}
              onNameChange={flowState.setWorkflowName}
              onDescriptionChange={flowState.setWorkflowDescription}
              onSave={() => flowState.saveWorkflow.mutate({ nodes: flowState.nodes, edges: flowState.edges })}
              tags={flowState.tags}
              onTagsChange={flowState.setTags}
              category={flowState.category}
              onCategoryChange={flowState.setCategory}
              categories={flowState.categories}
              showBrowserDialog={showBrowserDialog}
              setShowBrowserDialog={setShowBrowserDialog}
              showRecordDialog={showRecordDialog}
              setShowRecordDialog={setShowRecordDialog}
              handleStartWorkflow={handleStartWorkflow}
              handleRecordClick={handleRecordClick}
            />
          </FlowLayout>
        );
      }}
    </WorkflowStateProvider>
  );
};

export default Index;
