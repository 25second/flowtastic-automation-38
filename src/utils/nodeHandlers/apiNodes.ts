
import { FlowNodeWithData } from '@/types/flow';

export const handleApiNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'api-get':
      return `
    // Execute GET request
    const getResponse = await fetch('${node.data.settings?.url || ''}', {
      method: 'GET',
      headers: ${node.data.settings?.headers || '{}'},
    });
    if (!getResponse.ok) {
      throw new Error('GET request failed: ' + getResponse.statusText);
    }
    const getData = await getResponse.json();`;

    case 'api-post':
      return `
    // Execute POST request
    const postResponse = await fetch('${node.data.settings?.url || ''}', {
      method: 'POST',
      headers: ${node.data.settings?.headers || '{}'},
      body: JSON.stringify(${node.data.settings?.body || '{}'})
    });
    if (!postResponse.ok) {
      throw new Error('POST request failed: ' + postResponse.statusText);
    }
    const postData = await postResponse.json();`;

    case 'api-put':
      return `
    // Execute PUT request
    const putResponse = await fetch('${node.data.settings?.url || ''}', {
      method: 'PUT',
      headers: ${node.data.settings?.headers || '{}'},
      body: JSON.stringify(${node.data.settings?.body || '{}'})
    });
    if (!putResponse.ok) {
      throw new Error('PUT request failed: ' + putResponse.statusText);
    }
    const putData = await putResponse.json();`;

    case 'api-delete':
      return `
    // Execute DELETE request
    const deleteResponse = await fetch('${node.data.settings?.url || ''}', {
      method: 'DELETE',
      headers: ${node.data.settings?.headers || '{}'}
    });
    if (!deleteResponse.ok) {
      throw new Error('DELETE request failed: ' + deleteResponse.statusText);
    }
    const deleteData = await deleteResponse.json();`;

    default:
      return '';
  }
};
