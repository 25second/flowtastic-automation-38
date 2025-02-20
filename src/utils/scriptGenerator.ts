
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { processNode } from './nodeProcessors';

export const generateScript = (nodes: FlowNodeWithData[], edges: Edge[]) => {
  let script = `
  const results = [];
  const global = {
    browser: null,
    page: null,
    extractedData: null,
    lastApiResponse: null,
    lastScriptResult: null
  };
  
  try {
    console.log('Starting workflow execution...');
    if (!browserConnection || !browserConnection.wsEndpoint) {
      throw new Error('Browser connection information is missing');
    }`;
  
  // Sort nodes based on connections to determine execution order
  const nodeMap = new Map(nodes.map(node => [node.id, { ...node, visited: false }]));
  const startNodes = nodes.filter(node => !edges.some(edge => edge.target === node.id));
  
  const traverse = (node: FlowNodeWithData | undefined) => {
    if (!node || nodeMap.get(node.id)?.visited) return;
    
    const currentNode = nodeMap.get(node.id);
    if (currentNode) {
      currentNode.visited = true;
      script += `
    try {
      // Executing node: ${node.data.label || node.type}
      ${processNode(node)}
      results.push({ nodeId: "${node.id}", success: true });
    } catch (error) {
      console.error('Node execution error:', error);
      results.push({ nodeId: "${node.id}", success: false, error: error.message });
      throw error;
    }`;
      
      const connectedEdges = edges.filter(edge => edge.source === node.id);
      connectedEdges.forEach(edge => {
        const nextNode = nodes.find(n => n.id === edge.target);
        traverse(nextNode);
      });
    }
  };
  
  startNodes.forEach(traverse);
  
  script += `
    return { success: true, results };
  } catch (error) {
    console.error('Workflow execution error:', error);
    return { success: false, error: error.message, results };
  } finally {
    if (global.browser) {
      await global.browser.disconnect();
    }
  }`;
  
  return script;
};
