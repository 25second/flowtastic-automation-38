
import { useState } from 'react';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { AIDialog } from './AIDialog';
import { ServerDialog } from './ServerDialog';
import { ScriptDialog } from './ScriptDialog';
import { BrowserGPTDialog } from '../ai/BrowserGPTDialog';
import { FlowNodeWithData } from '@/types/flow';
import { Edge } from '@xyflow/react';

interface FlowDialogsProps {
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
  showBrowserGPTDialog: boolean;
  setShowBrowserGPTDialog: (show: boolean) => void;
  onSave: () => void;
}

export const FlowDialogs = ({
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
  showBrowserGPTDialog,
  setShowBrowserGPTDialog,
  onSave
}: FlowDialogsProps) => {
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
        onSave={onSave}
      />
      
      <ScriptDialog
        open={showScriptDialog}
        onOpenChange={setShowScriptDialog}
        nodes={nodes}
        edges={edges}
      />

      <BrowserGPTDialog
        open={showBrowserGPTDialog}
        onOpenChange={setShowBrowserGPTDialog}
      />
    </>
  );
};
