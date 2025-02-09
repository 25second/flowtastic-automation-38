import { Node, Edge } from '@xyflow/react';

export const generateScript = (nodes: Node[], edges: Edge[]) => {
  let script = `// Workflow Automation Script
(async function runWorkflow() {
  try {
    console.log('Starting workflow execution...');
`;
  
  // Sort nodes based on connections to determine execution order
  const nodeMap = new Map(nodes.map(node => [node.id, { ...node, visited: false }]));
  const startNodes = nodes.filter(node => !edges.some(edge => edge.target === node.id));
  
  const processNode = (node: any) => {
    let nodeScript = '';
    
    switch (node.type) {
      case 'trigger-schedule':
        nodeScript = `
    // Schedule trigger
    const schedule = "${node.data.settings?.cronExpression || '* * * * *'}";
    console.log('Schedule would run at:', schedule);`;
        break;

      case 'trigger-event':
        nodeScript = `
    // Event trigger
    console.log('Waiting for event:', "${node.data.settings?.eventType}");
    await new Promise(resolve => setTimeout(resolve, ${node.data.settings?.delay || 0}));`;
        break;

      case 'tab-new':
        nodeScript = `
    // Open new tab
    const newTab = window.open("${node.data.settings?.url || ''}", "_blank");
    if (newTab) {
      console.log('New tab opened');
    } else {
      throw new Error('Popup was blocked. Please allow popups for this site.');
    }`;
        break;

      case 'tab-close':
        nodeScript = `
    // Close tab
    window.close();
    console.log('Tab closed');`;
        break;

      case 'tab-switch':
        nodeScript = `
    // Note: Cannot switch tabs from console
    console.log('Tab switching is not available in console mode');`;
        break;

      case 'page-click':
        nodeScript = `
    // Click element
    const clickElement = document.querySelector("${node.data.settings?.selector || ''}");
    if (clickElement) {
      clickElement.click();
      console.log('Clicked element:', "${node.data.settings?.selector}");
    } else {
      throw new Error('Element not found: ${node.data.settings?.selector}');
    }`;
        break;

      case 'page-type':
        nodeScript = `
    // Type text
    const typeElement = document.querySelector("${node.data.settings?.selector || ''}");
    if (typeElement) {
      typeElement.value = "${node.data.settings?.text || ''}";
      // Trigger input event
      typeElement.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('Typed text into:', "${node.data.settings?.selector}");
    } else {
      throw new Error('Element not found: ${node.data.settings?.selector}');
    }`;
        break;

      case 'page-scroll':
        nodeScript = `
    // Scroll page
    const scrollElement = "${node.data.settings?.selector}" ? 
      document.querySelector("${node.data.settings?.selector}") : 
      document.documentElement;
    if (scrollElement) {
      scrollElement.scrollIntoView({ 
        behavior: "${node.data.settings?.behavior || 'smooth'}"
      });
      console.log('Scrolled to:', "${node.data.settings?.selector || 'top'}");
    } else {
      throw new Error('Scroll target not found');
    }`;
        break;

      case 'js-execute':
        nodeScript = `
    // Execute JavaScript
    try {
      ${node.data.settings?.code || '// No code provided'}
      console.log('Custom JavaScript executed');
    } catch (error) {
      throw new Error('Code execution failed: ' + error.message);
    }`;
        break;

      case 'js-evaluate':
        nodeScript = `
    // Evaluate JavaScript expression
    try {
      const result = ${node.data.settings?.expression || ''};
      console.log('Expression result:', result);
    } catch (error) {
      throw new Error('Expression evaluation failed: ' + error.message);
    }`;
        break;

      case 'screenshot-full':
      case 'screenshot-element':
        nodeScript = `
    // Note: Screenshots are not available in console mode
    console.log('Screenshots are not available in console mode');`;
        break;

      case 'data-extract':
        nodeScript = `
    // Extract data
    const elements = document.querySelectorAll("${node.data.settings?.selector || ''}");
    if (elements.length === 0) {
      throw new Error('No elements found: ${node.data.settings?.selector}');
    }
    const extractedData = Array.from(elements).map(el => 
      "${node.data.settings?.attribute || 'text'}" === 'text' ? 
        el.textContent : 
        el.getAttribute("${node.data.settings?.attribute || ''}")
    );
    console.log('Extracted data:', extractedData);`;
        break;

      case 'data-save':
        nodeScript = `
    // Save data to file
    const saveData = ${JSON.stringify(node.data.settings?.data || {})};
    const blob = new Blob([JSON.stringify(saveData)], { 
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "${node.data.settings?.filename || 'data'}.${node.data.settings?.format || 'json'}";
    a.click();
    URL.revokeObjectURL(url);
    console.log('Data saved to file');`;
        break;

      case 'flow-if':
        nodeScript = `
    // Conditional branch
    if (${node.data.settings?.condition || 'true'}) {
      console.log('Condition met:', "${node.data.settings?.description || ''}");
    }`;
        break;

      case 'flow-loop':
        nodeScript = `
    // Loop
    for (let i = 0; i < ${node.data.settings?.times || 1}; i++) {
      console.log('Loop iteration:', i + 1);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Prevent too rapid execution
    }`;
        break;

      case 'flow-wait':
        nodeScript = `
    // Wait
    await new Promise(resolve => setTimeout(resolve, ${node.data.settings?.duration || 1000}));
    console.log('Waited for ${node.data.settings?.duration || 1000}ms');`;
        break;

      default:
        nodeScript = `
    // Unknown node type: ${node.type}
    console.log('Node settings:', ${JSON.stringify(node.data.settings)});`;
    }
    
    return nodeScript;
  };

  const traverse = (node: any) => {
    if (!node || nodeMap.get(node.id)?.visited) return;
    
    const currentNode = nodeMap.get(node.id);
    if (currentNode) {
      currentNode.visited = true;
      script += processNode(node);
      
      const connectedEdges = edges.filter(edge => edge.source === node.id);
      connectedEdges.forEach(edge => {
        const nextNode = nodes.find(n => n.id === edge.target);
        traverse(nextNode);
      });
    }
  };
  
  startNodes.forEach(traverse);
  
  script += `
    console.log('Workflow completed successfully');
  } catch (error) {
    console.error('Workflow error:', error);
    throw error;
  }
})();`; // Add IIFE closure and immediate execution
  
  return script;
};
