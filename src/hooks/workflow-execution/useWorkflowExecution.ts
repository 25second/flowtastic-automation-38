
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { generateScript } from '@/utils/scriptGenerator';
import { toast } from 'sonner';
import { getStoredSessionPort } from '@/hooks/task-execution/useSessionManagement';
import { delay, waitForPort } from './portUtils';
import { findWebSocketEndpoint } from './wsEndpointUtils';
import { WorkflowExecutionParams } from './types';

const API_URL = 'http://localhost:3001';

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
      console.error('No server selected');
      toast.error('Please select a server before running the workflow');
      throw new Error('No server selected');
    }

    if (!nodes.length) {
      console.error('No nodes in workflow');
      toast.error('Workflow is empty');
      throw new Error('No nodes in workflow');
    }

    if (!params.browserPort || params.browserPort <= 0) {
      console.error(`Invalid browser port: ${params.browserPort}`);
      toast.error('Invalid browser port');
      throw new Error(`Invalid browser port: ${params.browserPort}`);
    }
    
    try {
      const script = generateScript(nodes, edges);
      console.log('Generated script:', script);

      let targetPort = params.browserPort;
      let browserInfo = null;
      let wsEndpoint = null;

      if (params.browserType === 'linkenSphere') {
        if (!params.sessionId) {
          throw new Error('Session ID is required for LinkenSphere connections');
        }

        const debugPort = getStoredSessionPort(params.sessionId);
        console.log(`Retrieved debug port for session ${params.sessionId}:`, debugPort);

        if (!debugPort) {
          console.warn(`No debug port found for session ${params.sessionId}, using provided port: ${params.browserPort}`);
          targetPort = params.browserPort;
        } else {
          targetPort = debugPort;
        }

        console.log(`Waiting for port ${targetPort} to become available...`);
        const isPortAvailable = await waitForPort(targetPort);
        if (!isPortAvailable) {
          throw new Error(`Port ${targetPort} did not become available after multiple attempts`);
        }

        wsEndpoint = await findWebSocketEndpoint(targetPort, params.sessionId);
        
        if (!wsEndpoint) {
          throw new Error('Could not find a valid WebSocket endpoint');
        }

        await delay(1000);
        console.log(`Final WebSocket endpoint: ${wsEndpoint}`);
      }
      
      const executionPayload = {
        script,
        browserConnection: {
          port: params.browserType === 'linkenSphere' ? 
            Number(localStorage.getItem('linkenSpherePort')) || 40080 : 
            params.browserPort,
          debugPort: targetPort,
          browserType: params.browserType,
          sessionId: params.sessionId,
          browserInfo,
          wsEndpoint,
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
          'Authorization': `Bearer ${serverToken}`
        },
        body: JSON.stringify(executionPayload),
      });

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

export type { WorkflowExecutionParams };
