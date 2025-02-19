
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { toast } from 'sonner';

const API_URL = 'http://localhost:3001';

export interface WorkflowExecutionParams {
  browserType: 'chrome' | 'linkenSphere';
  browserPort: number;
  sessionId?: string;
}

export const useWorkflowExecution = (selectedServer: string | null, serverToken: string) => {
  const startWorkflow = async (
    nodes: FlowNodeWithData[], 
    edges: Edge[], 
    params: WorkflowExecutionParams
  ) => {
    console.log('=== useWorkflowExecution.startWorkflow ===');
    console.log('Server:', selectedServer);
    console.log('Token:', serverToken);
    console.log('Params:', params);

    if (!selectedServer) {
      const error = new Error('No server selected');
      console.error(error);
      throw error;
    }

    if (!nodes.length) {
      const error = new Error('No nodes in workflow');
      console.error(error);
      throw error;
    }

    try {
      console.log('Starting workflow execution with params:', params);
      
      const response = await fetch(`${API_URL}/execute-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
        body: JSON.stringify({ 
          nodes, 
          edges, 
          browserType: params.browserType,
          browserPort: params.browserPort,
          sessionId: params.sessionId,
          serverId: selectedServer
        }),
      });

      console.log('Workflow execution response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      const data = await response.json();
      console.log('Workflow execution response:', data);
      return data;
    } catch (error) {
      console.error('Workflow execution error:', error);
      throw error;
    }
  };

  return { startWorkflow };
};
