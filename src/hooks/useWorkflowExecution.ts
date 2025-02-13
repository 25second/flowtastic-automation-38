
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
      console.log('Starting workflow with port:', browserPort);
      
      const response = await fetch(`${API_URL}/workflow/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
        body: JSON.stringify({ nodes, edges, browserPort }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Workflow start failed: ${errorData.message || response.statusText}`);
        return;
      }

      toast.success('Workflow started successfully');
    } catch (error) {
      console.error('Workflow start error:', error);
      toast.error('Failed to start workflow');
    }
  };

  return { startWorkflow };
};
