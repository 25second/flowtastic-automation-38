
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { handleTriggerNode } from './nodeHandlers/triggerNodes';
import { handleTabNode } from './nodeHandlers/tabNodes';
import { handlePageNode } from './nodeHandlers/pageNodes';
import { handleJavaScriptNode } from './nodeHandlers/javascriptNodes';
import { handleDataNode } from './nodeHandlers/dataNodes';
import { handleFlowNode } from './nodeHandlers/flowNodes';
import { handleScreenshotNode } from './nodeHandlers/screenshotNodes';
import { handleApiNode } from './nodeHandlers/apiNodes';

const processNode = (node: FlowNodeWithData) => {
  // Trigger nodes
  if (node.type?.startsWith('trigger-')) {
    return handleTriggerNode(node);
  }
  
  // Tab nodes
  if (node.type?.startsWith('tab-')) {
    return handleTabNode(node);
  }
  
  // Page nodes
  if (node.type?.startsWith('page-')) {
    return handlePageNode(node);
  }
  
  // JavaScript nodes
  if (node.type?.startsWith('js-')) {
    return handleJavaScriptNode(node);
  }
  
  // Data nodes
  if (node.type?.startsWith('data-')) {
    return handleDataNode(node);
  }
  
  // Flow nodes
  if (node.type?.startsWith('flow-')) {
    return handleFlowNode(node);
  }
  
  // Screenshot nodes
  if (node.type?.startsWith('screenshot-')) {
    return handleScreenshotNode(node);
  }

  // API nodes
  if (node.type?.startsWith('api-')) {
    return handleApiNode(node);
  }

  return `
    // Unknown node type: ${node.type}
    throw new Error("Unknown node type: ${node.type}");`;
};

export const generateScript = (nodes: FlowNodeWithData[], edges: Edge[]) => {
  let script = `// Browser Automation Script
(async () => {
  let results = [];
  try {`;
  
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
    return { success: false, error: error.message, results };
  }
})();`;
  
  return script;
};
