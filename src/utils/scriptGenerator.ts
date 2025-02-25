
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { processNode } from './nodeProcessors';

export const generateScript = (nodes: FlowNodeWithData[], edges: Edge[]) => {
  let script = `
const puppeteer = require('puppeteer-core');

// Configuration
const browserConnection = {
  wsEndpoint: process.env.BROWSER_WS_ENDPOINT || 'ws://127.0.0.1:YOUR_PORT'
};

const results = [];
const global = {
  browser: null,
  page: null,
  extractedData: null,
  lastApiResponse: null,
  lastScriptResult: null,
  lastTableRead: null,
  nodeOutputs: {},
  getNodeOutput: function(nodeId, output) {
    return this.nodeOutputs[nodeId]?.[output];
  },
  aiAgent: {
    async executeAction(action) {
      const pageContent = await this.page.content();
      
      const response = await fetch('${window.location.origin}/functions/v1/ai-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          action,
          pageContent
        })
      });

      if (!response.ok) {
        throw new Error('AI action failed: ' + await response.text());
      }

      const result = await response.json();
      console.log('AI action result:', result);

      switch (result.tool) {
        case 'click':
          await this.page.click(result.parameters.selector);
          break;
        case 'type':
          await this.page.type(result.parameters.selector, result.parameters.text);
          break;
        case 'navigate':
          await this.page.goto(result.parameters.url);
          break;
        case 'extract':
          const element = await this.page.$(result.parameters.selector);
          return await element.evaluate(el => el.textContent);
        default:
          throw new Error('Unknown tool: ' + result.tool);
      }

      return result;
    }
  }
};

async function main() {
  try {
    console.log('Starting workflow execution...');`;
  
  // Sort nodes based on connections to determine execution order
  const nodeMap = new Map(nodes.map(node => [node.id, { ...node, visited: false }]));
  const startNodes = nodes.filter(node => !edges.some(edge => edge.target === node.id));
  
  const traverse = (node: FlowNodeWithData | undefined) => {
    if (!node || nodeMap.get(node.id)?.visited) return;
    
    const currentNode = nodeMap.get(node.id);
    if (currentNode) {
      currentNode.visited = true;

      const incomingEdges = edges.filter(edge => edge.target === node.id);
      const connections = incomingEdges.map(edge => ({
        sourceNode: nodes.find(n => n.id === edge.source),
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      }));

      script += `
    try {
      // Executing node: ${node.data.label || node.type}
      ${processNode(node, connections)}
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
      try {
        await global.browser.close();
        console.log('Browser disconnected successfully');
      } catch (error) {
        console.error('Error disconnecting from browser:', error);
      }
    }
  }
}

// Run the workflow
main()
  .then(result => {
    console.log('Workflow completed:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Workflow failed:', error);
    process.exit(1);
  });`;
  
  return script;
};
