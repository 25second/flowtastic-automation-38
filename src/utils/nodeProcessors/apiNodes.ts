
import { FlowNodeWithData } from '@/types/flow';

export const processHttpRequestNode = (node: FlowNodeWithData) => {
  const method = node.data.settings?.method || 'GET';
  const url = node.data.settings?.url || '';
  const headers = node.data.settings?.headers || '{}';
  const body = node.data.settings?.body || '{}';
  return `
    // Send HTTP request
    console.log('Sending ${method} request to:', "${url}");
    const response = await fetch("${url}", {
      method: "${method}",
      headers: ${headers},
      ${method !== 'GET' ? `body: ${body},` : ''}
    });
    const responseData = await response.json();
    console.log('Response:', responseData);
    global.lastApiResponse = responseData;`;
};
