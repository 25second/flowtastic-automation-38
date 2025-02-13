
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ReactFlow, 
  Background, 
  Controls,
  ReactFlowInstance,
  Node,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from "@/components/workflow/nodeTypes";
import { WorkflowForm } from "@/components/workflow/WorkflowForm";
import { NodeDetailsSidebar } from "@/components/canvas/NodeDetailsSidebar";
import { CanvasHeader } from "@/components/canvas/CanvasHeader";
import { NodesPanel } from "@/components/workflow/NodesPanel";
import { serializeWorkflowData } from "@/utils/workflowUtils";
import { useWorkflowData } from "@/hooks/useWorkflowData";
import { useWorkflowFlow } from "@/hooks/useWorkflowFlow";
import { WorkflowFormProps, NodeData } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Play, Video, Wand2, Save } from "lucide-react";

const CanvasEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== "new";
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  const {
    workflow,
    setWorkflow,
    nodes,
    setNodes,
    edges,
    setEdges
  } = useWorkflowData(id, isEditing);

  const {
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop
  } = useWorkflowFlow(setNodes, setEdges);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }

    const { nodes: serializedNodes, edges: serializedEdges } = serializeWorkflowData(nodes, edges);

    const workflowData = {
      ...workflow,
      nodes: serializedNodes,
      edges: serializedEdges,
      user_id: session.user.id,
    };

    if (isEditing) {
      const { error } = await supabase
        .from('workflows')
        .update(workflowData)
        .eq('id', id);

      if (error) {
        toast.error("Error updating workflow");
        console.error("Error updating workflow:", error);
        return;
      }

      toast.success("Workflow updated successfully");
    } else {
      const { error } = await supabase
        .from('workflows')
        .insert([workflowData]);

      if (error) {
        toast.error("Error creating workflow");
        console.error("Error creating workflow:", error);
        return;
      }

      toast.success("Workflow created successfully");
    }

    navigate("/dashboard");
  };

  const workflowFormProps: WorkflowFormProps = {
    workflowName: workflow.name,
    workflowDescription: workflow.description,
    onNameChange: (name) => setWorkflow({ ...workflow, name }),
    onDescriptionChange: (description) => setWorkflow({ ...workflow, description }),
    onSave: handleSubmit,
    isEditing
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="gap-2"
        >
          ← Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button className="gap-2" variant="default">
            <Play className="h-4 w-4" />
            Start Workflow
          </Button>
          <Button className="gap-2" variant="default">
            <Video className="h-4 w-4" />
            Record Workflow
          </Button>
          <Button className="gap-2" variant="default">
            <Wand2 className="h-4 w-4" />
            Create with AI ✨
          </Button>
          <Button className="gap-2" variant="default" onClick={handleSubmit}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 border-r bg-muted/10 overflow-y-auto">
          <NodesPanel />
        </div>

        <div 
          className="flex-1 h-full" 
          ref={reactFlowWrapper}
          style={{ position: 'relative' }}
        >
          <ReactFlow<NodeData>
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Background />
            <Controls />
            <Panel position="top-left">
              <div className="bg-background p-2 rounded-md shadow-sm">
                <WorkflowForm {...workflowFormProps} />
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {selectedNode && (
          <NodeDetailsSidebar
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={(updatedData) => {
              setNodes(nodes.map(node => 
                node.id === selectedNode.id 
                  ? { ...node, data: { ...node.data, ...updatedData } }
                  : node
              ));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CanvasEditor;
