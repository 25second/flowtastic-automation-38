
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { toast } from 'sonner';

const API_URL = 'http://localhost:3001';

export const useWorkflowExecution = (selectedServer: string | null, serverToken: string) => {
  const startWorkflow = async (nodes: FlowNodeWithData[], edges: Edge[], browserPort: number) => {
    if (!selectedServer) {
      toast.error('No server selected');
      return;
    }

    if (!nodes.length) {
      toast.error('No nodes in workflow');
      return;
    }

    try {
      console.log('Sending workflow execution request:', {
        nodes,
        edges,
        browserPort,
        serverToken
      });
      
      const response = await fetch(`${API_URL}/execute-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
        body: JSON.stringify({ 
          nodes, 
          edges, 
          browserPort,
          serverId: selectedServer
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Workflow execution failed:', errorData);
        toast.error(`Workflow execution failed: ${errorData.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      console.log('Workflow execution response:', data);
      toast.success('Workflow executed successfully');
    } catch (error) {
      console.error('Workflow execution error:', error);
      toast.error('Failed to execute workflow');
    }
  };

  return { startWorkflow };
};
