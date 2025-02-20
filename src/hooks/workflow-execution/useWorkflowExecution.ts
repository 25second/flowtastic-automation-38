
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
    console.group('=== Workflow Execution Start ===');
    console.log('Configuration:', {
      selectedServer,
      serverToken: serverToken ? '***' : 'not set',
      params,
      nodesCount: nodes.length,
      edgesCount: edges.length
    });

    try {
      // Validation checks
      if (!selectedServer) {
        console.error('❌ Validation Error: No server selected');
        toast.error('Please select a server before running the workflow');
        throw new Error('No server selected');
      }

      if (!nodes.length) {
        console.error('❌ Validation Error: Empty workflow');
        toast.error('Workflow is empty');
        throw new Error('No nodes in workflow');
      }

      if (!params.browserPort || params.browserPort <= 0) {
        console.error('❌ Validation Error: Invalid browser port', params.browserPort);
        toast.error('Invalid browser port');
        throw new Error(`Invalid browser port: ${params.browserPort}`);
      }

      // Script Generation
      console.group('1. Script Generation');
      const script = generateScript(nodes, edges);
      console.log('Generated script:', script);
      console.groupEnd();

      let targetPort = params.browserPort;
      let browserInfo = null;
      let wsEndpoint = null;

      // Browser Connection Setup
      console.group('2. Browser Connection Setup');
      if (params.browserType === 'linkenSphere') {
        console.log('Using LinkenSphere browser type');
        
        if (!params.sessionId) {
          console.error('❌ No session ID provided for LinkenSphere connection');
          throw new Error('Session ID is required for LinkenSphere connections');
        }

        const debugPort = getStoredSessionPort(params.sessionId);
        console.log('Session details:', {
          sessionId: params.sessionId,
          storedDebugPort: debugPort,
          initialPort: params.browserPort
        });

        if (!debugPort) {
          console.warn('⚠️ No stored debug port found, using provided port:', params.browserPort);
          targetPort = params.browserPort;
        } else {
          console.log('Using stored debug port:', debugPort);
          targetPort = debugPort;
        }

        // Port availability check
        console.group('Port Availability Check');
        console.log(`Checking port ${targetPort}...`);
        const isPortAvailable = await waitForPort(targetPort);
        if (!isPortAvailable) {
          console.error(`❌ Port ${targetPort} not available after multiple attempts`);
          throw new Error(`Port ${targetPort} did not become available after multiple attempts`);
        }
        console.log(`✓ Port ${targetPort} is available`);
        console.groupEnd();

        // WebSocket endpoint discovery
        console.group('WebSocket Endpoint Discovery');
        wsEndpoint = await findWebSocketEndpoint(targetPort, params.sessionId);
        
        if (!wsEndpoint) {
          console.error('❌ Failed to find WebSocket endpoint');
          throw new Error('Could not find a valid WebSocket endpoint');
        }
        console.log('✓ Found WebSocket endpoint:', wsEndpoint);
        console.groupEnd();

        await delay(1000);
      }
      console.groupEnd();

      // Preparing execution payload
      console.group('3. Execution Payload Preparation');
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
      console.log('Final execution payload:', {
        ...executionPayload,
        script: '<<script content hidden>>'
      });
      console.groupEnd();

      // Workflow Execution
      console.group('4. Workflow Execution');
      console.log('Sending request to server...');
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
        console.error('❌ Server returned error:', errorData);
        throw new Error(errorData.message || response.statusText);
      }

      const data = await response.json();
      console.log('✓ Workflow execution response:', data);
      console.groupEnd();

      console.log('=== Workflow Execution Completed Successfully ===');
      console.groupEnd();
      return data;
    } catch (error) {
      console.error('❌ Workflow Execution Failed:', error);
      console.groupEnd();
      throw error;
    }
  };

  return { startWorkflow };
};

export type { WorkflowExecutionParams };
