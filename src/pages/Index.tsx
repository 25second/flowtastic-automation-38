
import '@xyflow/react/dist/style.css';
import { useServerState } from '@/hooks/useServerState';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { useFlowActions } from '@/hooks/useFlowActions';
import { Toolbar } from '@/components/flow/Toolbar';
import { FlowDialogs } from '@/components/flow/FlowDialogs';
import { WorkflowStateProvider } from '@/components/flow/WorkflowStateProvider';
import { Category } from '@/types/workflow';
import { WorkflowExecutionParams } from '@/hooks/useWorkflowExecution';

interface LinkenSphereSession {
  id: string;
  status: string;
  debug_port?: number;
}

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
          (nodes, edges, browserPort) => {
            const params: WorkflowExecutionParams = 
              typeof selectedBrowser === 'object' && selectedBrowser !== null
                ? {
                    browserType: 'linkenSphere',
                    browserPort: selectedBrowser.debug_port || 0,
                    sessionId: selectedBrowser.id
                  }
                : {
                    browserType: 'chrome',
                    browserPort: typeof browserPort === 'number' ? browserPort : 0
                  };
            return startWorkflow(nodes, edges, params);
          },
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
              onBrowserSelect={setSelectedBrowser as (value: number | LinkenSphereSession | null) => void}
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
              category={flowState.category as Category}
              onCategoryChange={flowState.setCategory as (category: Category) => void}
              categories={flowState.categories as Category[]}
              showBrowserDialog={showBrowserDialog}
              setShowBrowserDialog={setShowBrowserDialog}
              showRecordDialog={showRecordDialog}
              setShowRecordDialog={setShowRecordDialog}
              onStartWorkflow={startWorkflow}
              onStartRecording={startRecording}
              isRecording={isRecording}
            />
          </FlowLayout>
        );
      }}
    </WorkflowStateProvider>
  );
};

export default Index;
