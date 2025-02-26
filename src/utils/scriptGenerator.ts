import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { processNode } from './nodeProcessors';

export const generateScript = (nodes: FlowNodeWithData[], edges: Edge[], browserPort?: number) => {
  let script = `
const puppeteer = require('puppeteer-core');
const { request } = require('undici');

// Configuration
let browser;
let page;

async function getBrowserWSEndpoint(port) {
  try {
    // First try /json/version endpoint
    const versionResponse = await request(\`http://127.0.0.1:\${port}/json/version\`);
    const versionData = await versionResponse.body.json();
    if (versionData.webSocketDebuggerUrl) {
      return versionData.webSocketDebuggerUrl;
    }

    // If version endpoint doesn't work, try /json endpoint
    const response = await request(\`http://127.0.0.1:\${port}/json\`);
    const data = await response.body.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0].webSocketDebuggerUrl;
    }

    throw new Error('Could not find browser WebSocket endpoint');
  } catch (error) {
    console.error('Error getting browser WebSocket endpoint:', error);
    throw error;
  }
}

async function initBrowser() {
  try {
    const port = ${browserPort || "YOUR_PORT"};
    const wsEndpoint = await getBrowserWSEndpoint(port);
    console.log('Found browser WebSocket endpoint:', wsEndpoint);

    // Connect to the existing browser instance
    browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
      defaultViewport: null
    });
    
    // Get existing pages
    const pages = await browser.pages();
    page = pages[0];
    
    if (!page) {
      console.log('No existing page found, creating new one');
      page = await browser.newPage();
    }
    
    console.log('Successfully connected to browser');
  } catch (error) {
    console.error('Failed to connect to browser:', error);
    throw error;
  }
}

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
  }
};

async function main() {
  const results = [];
  
  try {
    console.log('Starting workflow execution...');
    
    // Initialize browser connection
    await initBrowser();
    global.browser = browser;
    global.page = page;
    
    // Execute workflow nodes
`;
  
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
    if (browser) {
      // Don't close the browser, just disconnect from it
      try {
        await browser.disconnect();
        console.log('Successfully disconnected from browser');
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
