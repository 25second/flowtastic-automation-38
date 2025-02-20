
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

        // Пытаемся получить информацию о браузере
        try {
          // Получаем информацию о версии браузера
          const versionResponse = await fetch(`http://127.0.0.1:${targetPort}/json/version`);
          if (versionResponse.ok) {
            browserInfo = await versionResponse.json();
            console.log('Browser version info:', browserInfo);
            
            // Сохраняем полный WebSocket URL из version info
            if (browserInfo.webSocketDebuggerUrl) {
              wsEndpoint = browserInfo.webSocketDebuggerUrl;
              console.log('Found complete WebSocket endpoint:', wsEndpoint);
            }
          }

          // Если не получили WebSocket URL из version, проверяем список страниц
          if (!wsEndpoint) {
            const listResponse = await fetch(`http://127.0.0.1:${targetPort}/json/list`);
            if (listResponse.ok) {
              const pagesList = await listResponse.json();
              console.log('Active pages:', pagesList);

              // Используем полный WebSocket URL из первой страницы
              if (pagesList.length > 0) {
                if (pagesList[0].webSocketDebuggerUrl) {
                  wsEndpoint = pagesList[0].webSocketDebuggerUrl;
                  console.log('Using complete WebSocket endpoint from first page:', wsEndpoint);
                } else if (pagesList[0].devtoolsFrontendUrl) {
                  // Извлекаем полный WebSocket URL из devtoolsFrontendUrl
                  const match = pagesList[0].devtoolsFrontendUrl.match(/ws=([^&]+)/);
                  if (match) {
                    wsEndpoint = decodeURIComponent(match[1]);
                    console.log('Extracted complete WebSocket endpoint from devtools URL:', wsEndpoint);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.warn(`Could not verify port ${targetPort}, but continuing:`, error);
        }

        // Если не получили WebSocket URL, пробуем получить browserSessionId
        if (!wsEndpoint) {
          try {
            const versionResponse = await fetch(`http://127.0.0.1:${targetPort}/json/version`);
            if (versionResponse.ok) {
              const versionInfo = await versionResponse.json();
              if (versionInfo.Browser) {
                const match = versionInfo.Browser.match(/\(([^)]+)\)/);
                if (match) {
                  const sessionId = match[1];
                  wsEndpoint = `ws://127.0.0.1:${targetPort}/devtools/browser/${sessionId}`;
                  console.log('Constructed WebSocket endpoint with session ID:', wsEndpoint);
                }
              }
            }
          } catch (error) {
            console.warn('Could not get browser session ID:', error);
          }
        }

        // Если все еще нет WebSocket URL, используем базовый endpoint
        if (!wsEndpoint) {
          wsEndpoint = `ws://127.0.0.1:${targetPort}/devtools/browser`;
          console.log('Using base WebSocket endpoint:', wsEndpoint);
        }

        console.log(`Using port ${targetPort} for session ${params.sessionId}`);
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
