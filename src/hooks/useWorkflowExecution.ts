
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { generateScript } from '@/utils/scriptGenerator';
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

    // Remove the strict port validation and just ensure it's a number
    const port = Number(params.browserPort);
    if (isNaN(port)) {
      const error = new Error('Browser port must be a valid number');
      console.error(error);
      throw error;
    }
    
    try {
      // Generate the automation script
      const script = generateScript(nodes, edges);
      console.log('Generated script:', script);

      // Create the WebSocket endpoint URL based on browser type and port
      let wsEndpoint = '';
      if (params.browserType === 'linkenSphere') {
        if (!params.sessionId) {
          throw new Error('Session ID is required for LinkenSphere connections');
        }
        wsEndpoint = `ws://localhost:${port}/devtools/browser/${params.sessionId}`;
      } else {
        wsEndpoint = `ws://localhost:${port}/devtools/browser`;
      }
      
      console.log('WebSocket endpoint:', wsEndpoint);
      
      const executionPayload = {
        script,
        browserConnection: {
          wsEndpoint,
          browserType: params.browserType,
          port: port,
          sessionId: params.sessionId,
          isAutomationRunning: true
        },
        nodes,
        edges,
        serverId: selectedServer
      };

      console.log('Sending execution payload:', executionPayload);
      
      const response = await fetch(`${API_URL}/execute-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serverToken}`,
        },
        body: JSON.stringify(executionPayload),
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
