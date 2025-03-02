
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlowState } from '@/hooks/useFlowState';
import { useWorkflowManager } from '@/hooks/useWorkflowManager';
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { Category } from '@/types/workflow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ClockIcon } from 'lucide-react';

export interface FlowState {
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
  saveWorkflow: (data: { 
    id?: string; 
    nodes: FlowNodeWithData[]; 
    edges: Edge[];
    workflowName: string;
    workflowDescription: string;
    tags: string[];
    category: Category | null;
  }) => void;
  category: Category | null;
  setCategory: (category: Category | null) => void;
  categories: Category[];
  existingWorkflow: any;
  versions: { timestamp: number; nodes: FlowNodeWithData[]; edges: Edge[] }[];
  showVersions: boolean;
  setShowVersions: (show: boolean) => void;
  restoreVersion: (version: { timestamp: number; nodes: FlowNodeWithData[]; edges: Edge[] }) => void;
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
    versions,
    showVersions,
    setShowVersions,
    restoreVersion,
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

  const handleSaveWorkflow = (data: { 
    id?: string; 
    nodes: FlowNodeWithData[]; 
    edges: Edge[];
  }) => {
    saveWorkflow.mutate({
      ...data,
      workflowName,
      workflowDescription,
      tags,
      category
    });
  };

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
    saveWorkflow: handleSaveWorkflow,
    category,
    setCategory,
    categories,
    existingWorkflow,
    versions,
    showVersions,
    setShowVersions,
    restoreVersion,
  };

  return (
    <>
      {children(flowState)}
      <Dialog open={showVersions} onOpenChange={setShowVersions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Workflow Versions</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full pr-4">
            <div className="space-y-2">
              {versions.map((version, index) => (
                <div
                  key={version.timestamp}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        Version {versions.length - index}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(version.timestamp, 'HH:mm:ss dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restoreVersion(version)}
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
