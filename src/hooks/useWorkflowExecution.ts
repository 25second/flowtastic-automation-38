
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

        // Пытаемся получить информацию о браузере
        try {
          // Проверяем сначала /json/version для получения базовой информации
          const versionResponse = await fetch(`http://127.0.0.1:${targetPort}/json/version`);
          if (versionResponse.ok) {
            browserInfo = await versionResponse.json();
            console.log('Browser version info:', browserInfo);
            
            if (browserInfo.webSocketDebuggerUrl) {
              wsEndpoint = browserInfo.webSocketDebuggerUrl;
              console.log('Found complete WebSocket endpoint from version:', wsEndpoint);
              await delay(1000);
            }
          }

          // Если не получили endpoint из version, проверяем список страниц
          if (!wsEndpoint) {
            const listResponse = await fetch(`http://127.0.0.1:${targetPort}/json/list`);
            if (listResponse.ok) {
              const pagesList = await listResponse.json();
              console.log('Active pages:', pagesList);

              if (pagesList.length > 0) {
                // Пробуем получить WebSocket URL из первой страницы
                if (pagesList[0].webSocketDebuggerUrl) {
                  wsEndpoint = pagesList[0].webSocketDebuggerUrl;
                  console.log('Found complete WebSocket endpoint from page:', wsEndpoint);
                }
                // Если нет прямого WebSocket URL, пробуем извлечь из devtoolsFrontendUrl
                else if (pagesList[0].devtoolsFrontendUrl) {
                  const match = pagesList[0].devtoolsFrontendUrl.match(/ws=([^&]+)/);
                  if (match) {
                    wsEndpoint = decodeURIComponent(match[1]);
                    console.log('Extracted WebSocket endpoint from devtools URL:', wsEndpoint);
                  }
                }
                // Если есть id страницы, можем использовать его
                if (!wsEndpoint && pagesList[0].id) {
                  wsEndpoint = `ws://127.0.0.1:${targetPort}/devtools/page/${pagesList[0].id}`;
                  console.log('Constructed WebSocket endpoint with page ID:', wsEndpoint);
                }
              }
            }
          }

          // Пробуем получить информацию о сессии браузера
          if (!wsEndpoint) {
            const browserEndpointUrl = `http://127.0.0.1:${targetPort}/json`;
            console.log('Trying to get browser endpoint info from:', browserEndpointUrl);
            
            try {
              const browserResponse = await fetch(browserEndpointUrl);
              if (browserResponse.ok) {
                const browserData = await browserResponse.json();
                console.log('Browser endpoint info:', browserData);
                
                if (Array.isArray(browserData) && browserData.length > 0) {
                  for (const data of browserData) {
                    if (data.webSocketDebuggerUrl) {
                      wsEndpoint = data.webSocketDebuggerUrl;
                      console.log('Found WebSocket endpoint from browser data:', wsEndpoint);
                      break;
                    }
                  }
                }
              }
            } catch (error) {
              console.warn('Could not get browser endpoint info:', error);
            }
          }
        } catch (error) {
          console.warn(`Could not verify port ${targetPort}, but continuing:`, error);
        }

        // Если все еще нет WebSocket URL, пробуем разные варианты эндпоинтов
        if (!wsEndpoint) {
          const endpoints = [
            `/json/version`, // Пробуем сначала получить информацию о версии
            `/json/list`,    // Затем список страниц
            `/devtools/page/${params.sessionId}`, // Пробуем подключиться к конкретной странице
            `/devtools/browser/${params.sessionId}`, // Пробуем подключиться к конкретной сессии браузера
            `/devtools/browser` // Базовый endpoint как последний вариант
          ];

          for (const endpoint of endpoints) {
            try {
              console.log(`Trying endpoint: ${endpoint}`);
              const testUrl = `http://127.0.0.1:${targetPort}${endpoint}`;
              const response = await fetch(testUrl);
              
              if (response.ok) {
                const data = await response.json();
                console.log(`Response from ${endpoint}:`, data);

                if (data.webSocketDebuggerUrl) {
                  wsEndpoint = data.webSocketDebuggerUrl;
                  console.log('Found WebSocket endpoint:', wsEndpoint);
                  await delay(1000);
                  break;
                }
                
                // Если это список страниц и он не пустой
                if (Array.isArray(data) && data.length > 0 && data[0].webSocketDebuggerUrl) {
                  wsEndpoint = data[0].webSocketDebuggerUrl;
                  console.log('Found WebSocket endpoint from page:', wsEndpoint);
                  await delay(1000);
                  break;
                }
              }
            } catch (error) {
              console.warn(`Endpoint ${endpoint} not available:`, error);
            }
          }
        }

        // Если все еще нет endpoint, используем базовый с идентификатором сессии
        if (!wsEndpoint) {
          wsEndpoint = `ws://127.0.0.1:${targetPort}/devtools/browser/${params.sessionId}`;
          console.log('Using base WebSocket endpoint with session ID:', wsEndpoint);
        }

        // Добавляем финальную задержку перед отправкой endpoint
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
