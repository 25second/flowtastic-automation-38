
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlowState } from '@/hooks/useFlowState';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { useState } from 'react';
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { Category } from '@/types/workflow';

interface FlowState {
  nodes: FlowNodeWithData[];
  edges: Edge[];
  setNodes: (nodes: FlowNodeWithData[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (desc: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  saveWorkflow: (data: { id?: string; nodes: FlowNodeWithData[]; edges: Edge[] }) => void;
  category: Category | null;
  setCategory: (category: Category | null) => void;
  categories: Category[];
  existingWorkflow: any;
}

interface WorkflowStateProviderProps {
  children: (flowState: FlowState) => React.ReactElement;
}

export const WorkflowStateProvider = ({ children }: WorkflowStateProviderProps) => {
  const location = useLocation();
  const existingWorkflow = location.state?.workflow;
  const [category, setCategory] = useState<Category | null>(null);
  const [categories] = useState<Category[]>([
    { id: '1', name: 'Development', description: 'Development workflows' },
    { id: '2', name: 'Testing', description: 'Testing workflows' },
    { id: '3', name: 'Production', description: 'Production workflows' }
  ]);

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    resetFlow,
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

  useEffect(() => {
    if (existingWorkflow) {
      setNodes(existingWorkflow.nodes || []);
      setEdges(existingWorkflow.edges || []);
      setWorkflowName(existingWorkflow.name || '');
      setWorkflowDescription(existingWorkflow.description || '');
      setTags(existingWorkflow.tags || []);
      if (existingWorkflow.category) {
        const existingCategory = categories.find(c => c.id === existingWorkflow.category.id);
        setCategory(existingCategory || null);
      }
    } else {
      resetFlow();
    }
  }, [existingWorkflow, setNodes, setEdges, resetFlow, setWorkflowName, setWorkflowDescription, setTags, categories]);

  const flowState: FlowState = {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    tags,
    setTags,
    showSaveDialog,
    setShowSaveDialog,
    saveWorkflow: saveWorkflow.mutate,
    category,
    setCategory,
    categories,
    existingWorkflow
  };

  return children(flowState);
};
