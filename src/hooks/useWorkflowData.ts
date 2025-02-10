
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Node, Edge } from 'reactflow';
import { WorkflowData } from '@/types/workflow';
import { deserializeWorkflowData } from '@/utils/workflowUtils';

export const useWorkflowData = (id: string | undefined, isEditing: boolean) => {
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<WorkflowData>({
    name: "",
    description: "",
  });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      if (isEditing) {
        fetchWorkflow();
      }
    };
    
    checkUser();
  }, [navigate, id, isEditing]);

  const fetchWorkflow = async () => {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Error fetching workflow");
      console.error("Error fetching workflow:", error);
      navigate("/dashboard");
      return;
    }

    const { nodes: deserializedNodes, edges: deserializedEdges } = deserializeWorkflowData(data.nodes, data.edges);
    
    setWorkflow(data);
    setNodes(deserializedNodes);
    setEdges(deserializedEdges);
  };

  return {
    workflow,
    setWorkflow,
    nodes,
    setNodes,
    edges,
    setEdges
  };
};
