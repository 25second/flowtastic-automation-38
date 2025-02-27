
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';

export const generateWorkflowExecutionCode = (nodes: FlowNodeWithData[], edges: Edge[]) => `
async function main() {
  const results = [];
  
  try {
    console.log('Starting workflow execution...');
    
    await connectToBrowser();
    global.browser = browser;
    global.context = context;
    global.page = page;
    
    // Execute generate-person nodes first
    const generatePersonNodes = nodes.filter(node => node.type === 'generate-person');
    console.log('Executing generate-person nodes first:', generatePersonNodes.map(n => n.id));
    
    for (const node of generatePersonNodes) {
      try {
        console.log('Executing generate-person node:', node.id);
        ${nodes
          .filter(node => node.type === 'generate-person')
          .map(node => `
            ${processNode(node, [])}
            results.push({ nodeId: '${node.id}', success: true });
          `)
          .join('\n')}
      } catch (error) {
        console.error('Generate-person node execution error:', error);
        results.push({ nodeId: node.id, success: false, error: error.message });
        throw error;
      }
    }
    
    // Execute remaining nodes in order
    const remainingNodes = nodes.filter(node => node.type !== 'generate-person');
    const nodeMap = new Map(remainingNodes.map(node => [node.id, { ...node, visited: false }]));
    const startNodes = remainingNodes.filter(node => !edges.some(edge => edge.target === node.id));
    
    const traverse = async (node) => {
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

        try {
          global.page = pageStore.getCurrentPage();
          console.log('Executing node:', node.data.label || node.type);
          
          ${nodes
            .filter(node => node.type !== 'generate-person')
            .map(node => `
              if (node.id === '${node.id}') {
                ${processNode(node, [])}
                results.push({ nodeId: '${node.id}', success: true });
              }
            `)
            .join('\n')}
        } catch (error) {
          console.error('Node execution error:', error);
          results.push({ nodeId: node.id, success: false, error: error.message });
          throw error;
        }
        
        const connectedEdges = edges.filter(edge => edge.source === node.id);
        for (const edge of connectedEdges) {
          const nextNode = nodes.find(n => n.id === edge.target);
          await traverse(nextNode);
        }
      }
    };
    
    for (const startNode of startNodes) {
      await traverse(startNode);
    }
    
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
}`;
