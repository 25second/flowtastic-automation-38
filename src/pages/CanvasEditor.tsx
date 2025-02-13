
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ReactFlow, 
  Background, 
  Controls,
  ReactFlowInstance,
  Node
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
import { WorkflowFormProps } from "@/types/workflow";

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
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b">
        <div className="container py-2">
          <CanvasHeader 
            isEditing={isEditing}
            onBack={() => navigate("/dashboard")}
          />
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 border-r bg-muted/10">
          <NodesPanel />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="border-b px-4 py-2">
            <WorkflowForm {...workflowFormProps} />
          </div>

          <div className="flex-1 flex">
            <div className="flex-1" ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={(event) => onDrop(event, reactFlowInstance, reactFlowWrapper, nodes)}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
            
            <NodeDetailsSidebar
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdate={(updatedData) => {
                if (selectedNode) {
                  setNodes(nodes.map(node => 
                    node.id === selectedNode.id 
                      ? { ...node, data: { ...node.data, ...updatedData } }
                      : node
                  ));
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
