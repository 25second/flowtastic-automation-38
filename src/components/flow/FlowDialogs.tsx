
import React from 'react';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { ScriptDialog } from './ScriptDialog';
import { ServerDialog } from './ServerDialog';

interface FlowDialogsProps {
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  showServerDialog: boolean;
  setShowServerDialog: (show: boolean) => void;
  showScriptDialog: boolean;
  setShowScriptDialog: (show: boolean) => void;
  nodes: any[];
  edges: any[];
  saveWorkflow: any;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  category: any;
  setCategory: (category: any) => void;
}

export const FlowDialogs: React.FC<FlowDialogsProps> = ({
  showSaveDialog,
  setShowSaveDialog,
  showServerDialog,
  setShowServerDialog,
  showScriptDialog,
  setShowScriptDialog,
  nodes,
  edges,
  saveWorkflow,
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  tags,
  setTags,
  category,
  setCategory,
}) => {
  const handleSave = () => {
    saveWorkflow({
      nodes,
      edges,
      workflowName,
      workflowDescription,
      tags,
      category
    });
    setShowSaveDialog(false);
  };

  return (
    <>
      <SaveWorkflowDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSave}
        nodes={nodes}
        edges={edges}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowDescription={workflowDescription}
        setWorkflowDescription={setWorkflowDescription}
        tags={tags}
        setTags={setTags}
        category={category}
        setCategory={setCategory}
        categories={[]} // To be filled with actual categories
      />
      <ServerDialog open={showServerDialog} onOpenChange={setShowServerDialog} />
      <ScriptDialog open={showScriptDialog} onOpenChange={setShowScriptDialog} nodes={nodes} edges={edges} />
    </>
  );
};
