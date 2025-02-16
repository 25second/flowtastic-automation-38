
import { FlowNodeWithData } from '@/types/flow';

export const handleApiNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'api-get':
      return `
    // Execute GET request
    try {
      const response = await fetch('${node.data.settings?.url || ''}', {
        method: 'GET',
        headers: ${node.data.settings?.headers || '{}'},
        ${node.data.settings?.params ? `params: ${node.data.settings.params},` : ''}
      });
      const data = await response.json();
      console.log('GET request successful:', data);
      return data;
    } catch (error) {
      throw new Error('GET request failed: ' + error.message);
    }`;

    case 'api-post':
      return `
    // Execute POST request
    try {
      const response = await fetch('${node.data.settings?.url || ''}', {
        method: 'POST',
        headers: ${node.data.settings?.headers || '{}'},
        body: JSON.stringify(${node.data.settings?.body || '{}'})
      });
      const data = await response.json();
      console.log('POST request successful:', data);
      return data;
    } catch (error) {
      throw new Error('POST request failed: ' + error.message);
    }`;

    case 'api-put':
      return `
    // Execute PUT request
    try {
      const response = await fetch('${node.data.settings?.url || ''}', {
        method: 'PUT',
        headers: ${node.data.settings?.headers || '{}'},
        body: JSON.stringify(${node.data.settings?.body || '{}'})
      });
      const data = await response.json();
      console.log('PUT request successful:', data);
      return data;
    } catch (error) {
      throw new Error('PUT request failed: ' + error.message);
    }`;

    case 'api-delete':
      return `
    // Execute DELETE request
    try {
      const response = await fetch('${node.data.settings?.url || ''}', {
        method: 'DELETE',
        headers: ${node.data.settings?.headers || '{}'}
      });
      const data = await response.json();
      console.log('DELETE request successful:', data);
      return data;
    } catch (error) {
      throw new Error('DELETE request failed: ' + error.message);
    }`;

    default:
      return '';
  }
};
