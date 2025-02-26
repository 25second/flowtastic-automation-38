
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { processNode } from './nodeProcessors';

export const generateScript = (nodes: FlowNodeWithData[], edges: Edge[], browserPort?: number) => {
  let script = `
const { chromium } = require('playwright');

// Configuration
let browser;
let context;
let page;

// Store for active pages
const pageStore = {
  activePage: null,
  pages: new Map(),
  
  // Set current active page
  setActivePage(pageId, newPage) {
    this.pages.set(pageId, newPage);
    this.activePage = newPage;
    return newPage;
  },
  
  // Get page by ID
  getPage(pageId) {
    return this.pages.get(pageId);
  },
  
  // Get current active page
  getCurrentPage() {
    return this.activePage;
  }
};

async function getBrowserWSEndpoint(port) {
  try {
    const versionResponse = await fetch(\`http://127.0.0.1:\${port}/json/version\`);
    if (versionResponse.ok) {
      const versionData = await versionResponse.json();
      if (versionData.webSocketDebuggerUrl) {
        console.log('Found WS endpoint from /json/version:', versionData.webSocketDebuggerUrl);
        return versionData.webSocketDebuggerUrl;
      }
    }

    const response = await fetch(\`http://127.0.0.1:\${port}/json\`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0 && data[0].webSocketDebuggerUrl) {
        console.log('Found WS endpoint from /json:', data[0].webSocketDebuggerUrl);
        return data[0].webSocketDebuggerUrl;
      }
    }

    const directWsUrl = \`ws://127.0.0.1:\${port}/devtools/browser\`;
    console.log('Using direct WS URL:', directWsUrl);
    return directWsUrl;
  } catch (error) {
    console.error('Error getting browser WebSocket endpoint:', error);
    return \`ws://127.0.0.1:\${port}/devtools/browser\`;
  }
}

async function connectToBrowser() {
  try {
    const port = ${browserPort || "YOUR_PORT"};
    const wsEndpoint = await getBrowserWSEndpoint(port);
    
    console.log('Attempting to connect to browser at:', wsEndpoint);
    
    browser = await chromium.connectOverCDP({
      endpointURL: wsEndpoint,
      timeout: 30000,
      wsEndpoint: wsEndpoint
    });

    console.log('Successfully connected to browser');
    
    const contexts = await browser.contexts();
    context = contexts[0] || await browser.newContext();
    const pages = await context.pages();
    page = pages[0] || await context.newPage();
    
    // Initialize pageStore with first page
    pageStore.setActivePage('initial', page);
    
    console.log('Successfully initialized context and page');
  } catch (error) {
    console.error('Failed to connect to browser:', error);
    throw error;
  }
}

const global = {
  browser: null,
  context: null,
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
    
    await connectToBrowser();
    global.browser = browser;
    global.context = context;
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
      // Set current page as active for this node
      global.page = pageStore.getCurrentPage();
      console.log('Executing node:', '${node.data.label || node.type}');
      
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
      try {
        await browser.close();
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
