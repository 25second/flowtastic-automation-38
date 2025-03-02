
import React, { useState } from 'react';
import { FlowDialogs } from './FlowDialogs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FlowNodeWithData } from '@/types/flow';
import { Edge } from '@xyflow/react';
import { Category } from '@/types/workflow';

interface DialogManagerProps {
  nodes: FlowNodeWithData[];
  edges: Edge[];
  saveWorkflow: any;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  category: Category | null;
  setCategory: (category: Category | null) => void;
}

export const DialogManager: React.FC<DialogManagerProps> = ({
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
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showServerDialog, setShowServerDialog] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [serverToken, setServerToken] = useState('');
  
  const navigate = useNavigate();

  const handleSave = () => {
    if (!workflowName) {
      setShowSaveDialog(true);
      return;
    }

    try {
      saveWorkflow.mutateAsync({
        nodes,
        edges,
        workflowName,
        workflowDescription,
        tags,
        category
      });
      toast.success('Workflow saved');
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Error saving workflow');
    }
  };

  const handleShowStart = () => {
    setShowStartDialog(true);
  };

  const handleShowServer = () => {
    setShowServerDialog(true);
  };

  const handleRegister = () => {
    // Implement registration logic
    toast.success('Server registered');
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={handleShowStart}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Start Workflow
        </button>
        <button
          onClick={handleShowServer}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Connect to Server
        </button>
        <button
          onClick={() => navigate('/workflows')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Workflows
        </button>
      </div>
      <FlowDialogs
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        showServerDialog={showServerDialog}
        setShowServerDialog={setShowServerDialog}
        showStartDialog={showStartDialog}
        setShowStartDialog={setShowStartDialog}
        nodes={nodes}
        edges={edges}
        saveWorkflow={saveWorkflow}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowDescription={workflowDescription}
        setWorkflowDescription={setWorkflowDescription}
        tags={tags}
        setTags={setTags}
        category={category}
        setCategory={setCategory}
        serverToken={serverToken}
        setServerToken={setServerToken}
        onRegister={handleRegister}
      />
    </>
  );
};
