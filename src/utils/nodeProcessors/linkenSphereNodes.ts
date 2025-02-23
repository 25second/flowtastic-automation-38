
import { FlowNodeWithData } from '@/types/flow';

export const processLinkenSphereStopSessionNode = (node: FlowNodeWithData, browserPort: string) => {
  return `
    console.log('Stopping Linken Sphere session...');
    try {
      const port = ${browserPort} || '40080';
      const response = await fetch(\`http://127.0.0.1:\${port}/sessions/stop\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: global.sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to stop session: ' + response.statusText);
      }

      const result = await response.json();
      console.log('Session stop result:', result);
      global.nodeOutputs['${node.id}'] = { result: result };
    } catch (error) {
      console.error('Error stopping session:', error);
      throw error;
    }`;
};
