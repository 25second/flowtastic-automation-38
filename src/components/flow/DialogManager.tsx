
import { useState } from 'react';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { AIDialog } from './AIDialog';
import { ServerDialog } from './ServerDialog';
import { ScriptDialog } from './ScriptDialog';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { FlowNodeWithData } from '@/types/flow';
import { Edge } from '@xyflow/react';
import { toast } from 'sonner';

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
  const [aiPrompt, setAiPrompt] = useState("");
  const [serverToken, setServerToken] = useState("");
  const { saveWorkflow } = useWorkflowManager(nodes, edges);

  const handleAIGenerate = async (flow: { nodes: FlowNodeWithData[]; edges: Edge[] }) => {
    try {
      // Handle AI generation
      console.log("Generating with AI:", flow);
      toast.success("AI Generation completed");
    } catch (error) {
      console.error("AI Generation error:", error);
      toast.error("Failed to generate with AI");
    }
  };

  const handleServerRegister = async () => {
    try {
      // Handle server registration
      console.log("Registering server with token:", serverToken);
      toast.success("Server registered successfully");
      setShowServerDialog(false);
    } catch (error) {
      console.error("Server registration error:", error);
      toast.error("Failed to register server");
    }
  };

  const handleSave = async () => {
    try {
      await saveWorkflow();
      toast.success("Workflow saved successfully");
      setShowSaveDialog(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save workflow");
    }
  };

  return (
    <>
      <AIDialog 
        open={showAIDialog} 
        onOpenChange={setShowAIDialog}
        prompt={aiPrompt}
        setPrompt={setAiPrompt}
        onGenerate={handleAIGenerate}
      />
      
      <ServerDialog 
        open={showServerDialog} 
        onOpenChange={setShowServerDialog}
        token={serverToken}
        setToken={setServerToken}
        onRegister={handleServerRegister}
      />
      
      <SaveWorkflowDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        nodes={nodes}
        edges={edges}
        onSave={handleSave}
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
