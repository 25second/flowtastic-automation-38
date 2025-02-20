import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';

const processNode = (node: FlowNodeWithData) => {
  // Start node
  if (node.type === 'start') {
    return `
    // Initialize browser connection
    console.log('Initializing browser connection...');
    const browser = await puppeteer.connect({
      browserWSEndpoint: browserConnection.wsEndpoint,
      defaultViewport: null
    });
    global.browser = browser;`;
  }

  // End node
  if (node.type === 'end') {
    return `
    // End workflow execution
    console.log('Ending workflow execution...');
    if (global.page) {
      await global.page.close();
    }`;
  }

  // Open page node
  if (node.type === 'open-page') {
    const url = node.data.settings?.url || 'about:blank';
    return `
    // Open new page
    console.log('Opening new page:', "${url}");
    const page = await global.browser.newPage();
    await page.goto("${url}", { waitUntil: 'networkidle0' });
    global.page = page;`;
  }

  // Navigate node
  if (node.type === 'navigate') {
    const direction = node.data.settings?.direction || 'back';
    return `
    // Navigate ${direction}
    console.log('Navigating ${direction}...');
    await global.page.${direction}();`;
  }

  // Close tab node
  if (node.type === 'close-tab') {
    return `
    // Close current tab
    console.log('Closing current tab...');
    await global.page.close();`;
  }

  // Click node
  if (node.type === 'click') {
    const selector = node.data.settings?.selector || '';
    const clickType = node.data.settings?.clickType || 'single';
    const delay = node.data.settings?.delay || 0;
    return `
    // Click element
    console.log('Clicking element:', "${selector}");
    const element = await global.page.waitForSelector("${selector}");
    if (${delay} > 0) {
      await new Promise(resolve => setTimeout(resolve, ${delay}));
    }
    await element.click(${clickType === 'double' ? '{ clickCount: 2 }' : ''});`;
  }

  // Input node
  if (node.type === 'input') {
    const selector = node.data.settings?.selector || '';
    const text = node.data.settings?.text || '';
    const clearBefore = node.data.settings?.clearBefore || false;
    const delay = node.data.settings?.delay || 0;
    return `
    // Input text
    console.log('Typing text into:', "${selector}");
    const element = await global.page.waitForSelector("${selector}");
    ${clearBefore ? 'await element.click({ clickCount: 3 });' : ''}
    ${delay > 0 ? 'await new Promise(resolve => setTimeout(resolve, ' + delay + '));' : ''}
    await element.type("${text}");`;
  }

  // Extract data node
  if (node.type === 'extract') {
    const selector = node.data.settings?.selector || '';
    const dataType = node.data.settings?.dataType || 'text';
    const attribute = node.data.settings?.attribute || '';
    return `
    // Extract data
    console.log('Extracting data from:', "${selector}");
    const extractedData = await global.page.evaluate((selector, dataType, attribute) => {
      const elements = document.querySelectorAll(selector);
      return Array.from(elements).map(el => {
        if (dataType === 'text') return el.textContent;
        if (dataType === 'html') return el.innerHTML;
        if (dataType === 'attribute') return el.getAttribute(attribute);
        return null;
      });
    }, "${selector}", "${dataType}", "${attribute}");
    console.log('Extracted data:', extractedData);
    global.extractedData = extractedData;`;
  }

  // Save data node
  if (node.type === 'save-data') {
    const format = node.data.settings?.format || 'json';
    return `
    // Save extracted data
    console.log('Saving data...');
    if (global.extractedData) {
      const dataStr = ${format === 'json' ? 'JSON.stringify(global.extractedData, null, 2)' : 'global.extractedData.join("\\n")'};
      await global.page.evaluate((dataStr) => {
        const blob = new Blob([dataStr], { type: 'text/${format === 'json' ? 'json' : 'plain'}' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted-data.${format}';
        a.click();
        URL.revokeObjectURL(url);
      }, dataStr);
    }`;
  }

  // Wait node
  if (node.type === 'wait') {
    const mode = node.data.settings?.mode || 'delay';
    const value = node.data.settings?.value || 1000;
    const selector = node.data.settings?.selector || '';
    return `
    // Wait
    console.log('Waiting...');
    ${mode === 'delay' 
      ? `await new Promise(resolve => setTimeout(resolve, ${value}));`
      : `await global.page.waitForSelector("${selector}");`}`;
  }

  // Condition node
  if (node.type === 'condition') {
    const condition = node.data.settings?.condition || 'true';
    return `
    // Check condition
    console.log('Checking condition:', "${condition}");
    const conditionResult = await global.page.evaluate(() => {
      return ${condition};
    });
    if (!conditionResult) {
      throw new Error('Condition not met');
    }`;
  }

  // HTTP Request node
  if (node.type === 'http-request') {
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
  }

  // Run JavaScript node
  if (node.type === 'run-script') {
    const code = node.data.settings?.code || '';
    return `
    // Execute custom JavaScript
    console.log('Executing custom script...');
    const scriptResult = await global.page.evaluate(() => {
      ${code}
    });
    console.log('Script result:', scriptResult);
    global.lastScriptResult = scriptResult;`;
  }

  // Session stop node
  if (node.type === 'session-stop') {
    return `
    // Stop LinkSphere session
    console.log('Stopping session...');
    if (global.page) {
      await global.page.close();
    }
    if (global.browser) {
      await global.browser.disconnect();
    }`;
  }
  
  return `
    // Unknown node type: ${node.type}
    throw new Error("Unknown node type: ${node.type}");`;
};

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
