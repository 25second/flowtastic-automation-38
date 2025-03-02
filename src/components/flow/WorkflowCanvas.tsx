
import React from 'react';
import { Edge } from '@xyflow/react';
import { Category } from '@/types/workflow';
import { FlowNodeWithData } from '@/types/flow';
import { FlowLayout } from './FlowLayout';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';

interface WorkflowCanvasProps {
  initialNodes: FlowNodeWithData[];
  initialEdges: Edge[];
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  category: Category | null;
  setCategory: (category: Category | null) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  onSave: ({ nodes, edges, workflowName, workflowDescription, tags, category }: { 
    id?: string; 
    nodes: FlowNodeWithData[]; 
    edges: Edge[];
    workflowName: string;
    workflowDescription: string;
    tags: string[];
    category: Category | null;
  }) => void;
  onCancel: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  initialNodes,
  initialEdges,
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  tags,
  setTags,
  category,
  setCategory,
  showSaveDialog,
  setShowSaveDialog,
  onSave,
  onCancel,
}) => {
  const [nodes, setNodes] = React.useState<FlowNodeWithData[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

  const { handleDragOver, handleDrop } = useDragAndDrop(nodes, setNodes);

  const handleOnSave = () => {
    onSave({ 
      nodes, 
      edges,
      workflowName,
      workflowDescription,
      tags,
      category
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] relative">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Save Workflow
          </button>
        </div>
      </div>
      
      <div className="h-full bg-slate-100 rounded-md border">
        <FlowLayout
          nodes={nodes}
          edges={edges}
          onNodesChange={() => {}}
          onEdgesChange={() => {}}
          onConnect={() => {}}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Empty div as child to satisfy the children prop requirement */}
          <div></div>
        </FlowLayout>
      </div>

      <SaveWorkflowDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        nodes={nodes}
        edges={edges}
        onSave={handleOnSave}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowDescription={workflowDescription}
        setWorkflowDescription={setWorkflowDescription}
        tags={tags}
        setTags={setTags}
        category={category}
        setCategory={setCategory}
        categories={[]} // Will be filled from parent
      />
    </div>
  );
};
