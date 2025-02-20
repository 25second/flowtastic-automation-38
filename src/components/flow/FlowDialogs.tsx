
import { useState } from 'react';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { ScriptDialog } from './ScriptDialog';
import { useFlowState } from '@/hooks/useFlowState';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';

export function FlowDialogs() {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showScriptDialog, setShowScriptDialog] = useState(false);
  const { nodes, edges } = useFlowState();
  const {
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    category,
    setCategory,
    saveWorkflow,
  } = useWorkflowManager(nodes, edges);

  const handleSave = () => {
    saveWorkflow.mutate({ nodes, edges });
    setShowSaveDialog(false);
  };

  return (
    <>
      <SaveWorkflowDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        nodes={nodes}
        edges={edges}
        onSave={handleSave}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowDescription={workflowDescription}
        setWorkflowDescription={setWorkflowDescription}
        tags={tags}
        setTags={setTags}
        category={category}
        setCategory={setCategory}
        categories={[]} // You'll need to pass the actual categories here
      />
      <ScriptDialog
        open={showScriptDialog}
        onOpenChange={setShowScriptDialog}
        nodes={nodes}
        edges={edges}
      />
    </>
  );
}
