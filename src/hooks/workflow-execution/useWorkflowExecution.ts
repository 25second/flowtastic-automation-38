
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { generateScript } from '@/utils/scriptGenerator';
import { toast } from 'sonner';
import { getStoredSessionPort } from '@/hooks/task-execution/useSessionManagement';
import { delay, waitForPort } from './portUtils';
import { findWebSocketEndpoint } from './wsEndpointUtils';
import { WorkflowExecutionParams } from './types';
import { baseServerUrl } from '@/utils/constants';

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

      // Script Generation
      console.group('1. Script Generation');
      const script = generateScript(nodes, edges);
      console.log('Generated script:', script);
      console.groupEnd();

      let targetPort;
      let browserInfo = null;
      let wsEndpoint = null;
      const linkenSpherePort = Number(localStorage.getItem('linkenSpherePort')) || 40080;

      // Browser Connection Setup
      console.group('2. Browser Connection Setup');
      if (params.browserType === 'linkenSphere') {
        console.log('Using LinkenSphere browser type');
        
        if (!params.sessionId) {
          console.error('❌ No session ID provided for LinkenSphere connection');
          throw new Error('Session ID is required for LinkenSphere connections');
        }

        const debugPort = params.browserPort;
        console.log('Session details:', {
          sessionId: params.sessionId,
          debugPort,
          linkenSpherePort
        });

        if (!debugPort) {
          console.error('❌ No debug port provided for session');
          throw new Error('Debug port is required for browser connection');
        }

        targetPort = debugPort;

        // Port availability check
        console.group('Port Availability Check');
        console.log(`Checking browser debug port ${targetPort}...`);
        const isPortAvailable = await waitForPort(targetPort);
        if (!isPortAvailable) {
          console.error(`❌ Browser debug port ${targetPort} not available after multiple attempts`);
          throw new Error(`Port ${targetPort} did not become available after multiple attempts`);
        }
        console.log(`✓ Browser debug port ${targetPort} is available`);
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
      } else {
        targetPort = params.browserPort;
      }
      console.groupEnd();

      // Preparing execution payload
      console.group('3. Execution Payload Preparation');
      const executionPayload = {
        script,
        browserConnection: {
          port: linkenSpherePort,
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

      // Workflow Execution with timeout
      console.group('4. Workflow Execution');
      console.log('Sending request to server...');
      
      // Add timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(`${baseServerUrl}/workflow/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serverToken}`
          },
          body: JSON.stringify(executionPayload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = response.statusText;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (err) {
            // If parsing fails, use the status text
          }
          console.error('❌ Server returned error:', errorMessage);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('✓ Workflow execution response:', data);
        console.groupEnd();

        console.log('=== Workflow Execution Completed Successfully ===');
        console.groupEnd();
        return data;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error('❌ Workflow Execution Failed:', error);
      console.groupEnd();
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error during workflow execution';
      toast.error(`Workflow execution failed: ${errorMessage}`);
      
      throw error;
    }
  };

  return { startWorkflow };
};

export type { WorkflowExecutionParams };
