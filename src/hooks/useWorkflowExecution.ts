
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { generateScript } from '@/utils/scriptGenerator';
import { toast } from 'sonner';
import { getStoredSessionPort } from '@/hooks/task-execution/useSessionManagement';

const API_URL = 'http://localhost:3001';

export interface WorkflowExecutionParams {
  browserType: 'chrome' | 'linkenSphere';
  browserPort: number;
  sessionId?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkPortAvailable = async (port: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

const waitForPort = async (port: number, maxAttempts = 5): Promise<boolean> => {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Checking port ${port} availability (attempt ${i + 1}/${maxAttempts})...`);
    if (await checkPortAvailable(port)) {
      console.log(`Port ${port} is now available`);
      return true;
    }
    await delay(2000); // Wait 2 seconds between attempts
  }
  return false;
};

const getActivePages = async (port: number): Promise<any[]> => {
  try {
    // Try /json/list first (Chrome DevTools Protocol v1.3+)
    const listResponse = await fetch(`http://127.0.0.1:${port}/json/list`);
    if (listResponse.ok) {
      const pages = await listResponse.json();
      console.log('Got pages from /json/list:', pages);
      return pages;
    }

    // Fallback to /json (older versions)
    const jsonResponse = await fetch(`http://127.0.0.1:${port}/json`);
    if (jsonResponse.ok) {
      const pages = await jsonResponse.json();
      console.log('Got pages from /json:', pages);
      return pages;
    }

    return [];
  } catch (error) {
    console.warn('Failed to get active pages:', error);
    return [];
  }
};

const findWebSocketEndpoint = async (port: number, sessionId: string): Promise<string | null> => {
  try {
    // First try to get version info
    const versionResponse = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (versionResponse.ok) {
      const versionInfo = await versionResponse.json();
      if (versionInfo.webSocketDebuggerUrl) {
        console.log('Found WebSocket URL in version info:', versionInfo.webSocketDebuggerUrl);
        return versionInfo.webSocketDebuggerUrl;
      }
    }

    // Then try to get active pages
    const pages = await getActivePages(port);
    console.log('Active pages:', pages);

    if (pages.length > 0) {
      // First, try to find a page with webSocketDebuggerUrl
      const pageWithWs = pages.find(page => page.webSocketDebuggerUrl);
      if (pageWithWs) {
        console.log('Found page with WebSocket URL:', pageWithWs.webSocketDebuggerUrl);
        return pageWithWs.webSocketDebuggerUrl;
      }

      // Try to extract from devtoolsFrontendUrl
      const pageWithDevtools = pages.find(page => page.devtoolsFrontendUrl);
      if (pageWithDevtools) {
        const match = pageWithDevtools.devtoolsFrontendUrl.match(/ws=([^&]+)/);
        if (match) {
          const wsUrl = decodeURIComponent(match[1]);
          console.log('Extracted WebSocket URL from devtools URL:', wsUrl);
          return wsUrl;
        }
      }

      // Use the first page's ID to construct endpoint
      if (pages[0].id) {
        const wsUrl = `ws://127.0.0.1:${port}/devtools/page/${pages[0].id}`;
        console.log('Constructed WebSocket URL from page ID:', wsUrl);
        return wsUrl;
      }
    }

    // Try browser endpoint with session ID
    try {
      const response = await fetch(`http://127.0.0.1:${port}/devtools/page/${sessionId}`);
      if (response.ok) {
        const wsUrl = `ws://127.0.0.1:${port}/devtools/page/${sessionId}`;
        console.log('Using page-specific WebSocket URL:', wsUrl);
        return wsUrl;
      }
    } catch (error) {
      console.warn('Failed to connect to page-specific endpoint:', error);
    }

    // Default to a basic page endpoint
    return `ws://127.0.0.1:${port}/devtools/page/`;
  } catch (error) {
    console.error('Error finding WebSocket endpoint:', error);
    return null;
  }
};

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

      // Проверяем сессию LinkenSphere
      if (params.browserType === 'linkenSphere') {
        if (!params.sessionId) {
          throw new Error('Session ID is required for LinkenSphere connections');
        }

        // Get the stored debug port for this session
        const debugPort = getStoredSessionPort(params.sessionId);
        console.log(`Retrieved debug port for session ${params.sessionId}:`, debugPort);

        if (!debugPort) {
          console.warn(`No debug port found for session ${params.sessionId}, using provided port: ${params.browserPort}`);
          targetPort = params.browserPort;
        } else {
          targetPort = debugPort;
        }

        // Ждем пока порт станет доступным
        console.log(`Waiting for port ${targetPort} to become available...`);
        const isPortAvailable = await waitForPort(targetPort);
        if (!isPortAvailable) {
          throw new Error(`Port ${targetPort} did not become available after multiple attempts`);
        }

        // Пытаемся найти правильный WebSocket endpoint
        wsEndpoint = await findWebSocketEndpoint(targetPort, params.sessionId);
        
        if (!wsEndpoint) {
          throw new Error('Could not find a valid WebSocket endpoint');
        }

        // Добавляем задержку перед отправкой endpoint
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
