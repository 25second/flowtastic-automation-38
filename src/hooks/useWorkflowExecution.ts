
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
        throw new Error(errorData.message || response.statusText);
      }

      const data = await response.json();
      console.log('Workflow execution response:', data);
      toast.success('Workflow executed successfully');
    } catch (error) {
      console.error('Workflow execution error:', error);
      toast.error(`Failed to execute workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  return { startWorkflow };
};
