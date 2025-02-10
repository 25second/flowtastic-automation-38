
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactFlow, { 
  Background, 
  Controls,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from "@/components/workflow/nodeTypes";
import { WorkflowForm } from "@/components/workflow/WorkflowForm";
import { WorkflowHeader } from "@/components/workflow/WorkflowHeader";
import { NodesPanel } from "@/components/workflow/NodesPanel";
import { SessionSelectDialog } from "@/components/workflow/SessionSelectDialog";
import { serializeWorkflowData } from "@/utils/workflowUtils";
import { useWorkflowData } from "@/hooks/useWorkflowData";
import { useWorkflowFlow } from "@/hooks/useWorkflowFlow";
import { useWorkflowSession } from "@/hooks/useWorkflowSession";

const WorkflowEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== "new";
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
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

  const {
    showSessionDialog,
    setShowSessionDialog,
    handleRun,
    handleRunWithSessions
  } = useWorkflowSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b">
        <div className="container py-2">
          <WorkflowHeader 
            isEditing={isEditing}
            onBack={() => navigate("/dashboard")}
            onRun={isEditing ? handleRun : undefined}
          />
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 border-r bg-muted/10">
          <NodesPanel />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="border-b px-4 py-2">
            <WorkflowForm
              name={workflow.name}
              description={workflow.description}
              onNameChange={(name) => setWorkflow({ ...workflow, name })}
              onDescriptionChange={(description) => setWorkflow({ ...workflow, description })}
              onSubmit={handleSubmit}
              isEditing={isEditing}
            />
          </div>

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
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>

      <SessionSelectDialog
        open={showSessionDialog}
        onOpenChange={setShowSessionDialog}
        onConfirm={(sessions) => id && handleRunWithSessions(sessions, id)}
      />
    </div>
  );
};

export default WorkflowEditor;
