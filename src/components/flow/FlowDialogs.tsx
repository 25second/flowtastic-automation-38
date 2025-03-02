import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ServerDialog } from './ServerDialog';
import { ScriptDialog } from './ScriptDialog';
import { WorkflowStartDialog } from './WorkflowStartDialog';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { Category } from '@/types/workflow';

interface FlowDialogsProps {
  showScript: boolean;
  setShowScript: (show: boolean) => void;
  showStartDialog: boolean;
  setShowStartDialog: (show: boolean) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  showServerDialog: boolean;
  setShowServerDialog: (show: boolean) => void;
  serverToken: string;
  setServerToken: (token: string) => void;
  registerServer: () => void;
  nodes: FlowNodeWithData[];
  edges: Edge[];
  onStartConfirm: () => void;
  onSave: (data: {
    nodes: FlowNodeWithData[];
    edges: Edge[];
    workflowName: string;
    workflowDescription: string;
    tags: string[];
    category: Category | null;
  }) => void;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  category: Category | null;
  setCategory: (category: Category | null) => void;
  categories: Category[];
  editingWorkflow?: any;
}

export const FlowDialogs: React.FC<FlowDialogsProps> = ({
  showScript,
  setShowScript,
  showStartDialog,
  setShowStartDialog,
  showSaveDialog,
  setShowSaveDialog,
  showServerDialog,
  setShowServerDialog,
  serverToken,
  setServerToken,
  registerServer,
  nodes,
  edges,
  onStartConfirm,
  onSave,
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  tags,
  setTags,
  category,
  setCategory,
  categories,
  editingWorkflow,
}) => {
  return (
    <>
      <ScriptDialog 
        open={showScript} 
        onOpenChange={setShowScript} 
        nodes={nodes} 
        edges={edges} 
      />
      
      <WorkflowStartDialog 
        open={showStartDialog} 
        onOpenChange={setShowStartDialog} 
        onConfirm={onStartConfirm} 
      />
      
      <SaveWorkflowDialog 
        open={showSaveDialog} 
        onOpenChange={setShowSaveDialog} 
        nodes={nodes} 
        edges={edges} 
        onSave={onSave}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowDescription={workflowDescription}
        setWorkflowDescription={setWorkflowDescription}
        tags={tags}
        setTags={setTags}
        category={category}
        setCategory={setCategory}
        categories={categories}
        editingWorkflow={editingWorkflow}
      />
      
      <ServerDialog
        open={showServerDialog}
        onOpenChange={setShowServerDialog}
        token={serverToken}
        setToken={setServerToken}
        onRegister={registerServer}
      />
    </>
  );
};
