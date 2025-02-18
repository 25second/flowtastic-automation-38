
import { useState } from 'react';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { AIDialog } from './AIDialog';
import { ServerDialog } from './ServerDialog';
import { ScriptDialog } from './ScriptDialog';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { FlowNodeWithData } from '@/types/flow';
import { Edge } from '@xyflow/react';

interface DialogManagerProps {
  nodes: FlowNodeWithData[];
  edges: Edge[];
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  showServerDialog: boolean;
  setShowServerDialog: (show: boolean) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  showScriptDialog: boolean;
  setShowScriptDialog: (show: boolean) => void;
}

export const DialogManager = ({
  nodes,
  edges,
  showAIDialog,
  setShowAIDialog,
  showServerDialog,
  setShowServerDialog,
  showSaveDialog,
  setShowSaveDialog,
  showScriptDialog,
  setShowScriptDialog,
}: DialogManagerProps) => {
  const { saveWorkflow } = useWorkflowManager(nodes, edges);

  return (
    <>
      <AIDialog 
        open={showAIDialog} 
        onOpenChange={setShowAIDialog}
      />
      
      <ServerDialog 
        open={showServerDialog} 
        onOpenChange={setShowServerDialog} 
      />
      
      <SaveWorkflowDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        nodes={nodes}
        edges={edges}
        onSave={saveWorkflow}
      />
      
      <ScriptDialog
        open={showScriptDialog}
        onOpenChange={setShowScriptDialog}
        nodes={nodes}
        edges={edges}
      />
    </>
  );
};
