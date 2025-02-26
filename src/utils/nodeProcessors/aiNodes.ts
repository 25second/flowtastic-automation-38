
import { FlowNodeWithData } from '@/types/flow';

export const processAIActionNode = (node: FlowNodeWithData) => {
  const action = node.data.settings?.action || '';
  
  return `
    // AI Action: ${action}
    console.log('Executing AI action:', ${JSON.stringify(action)});
    try {
      const result = await global.aiAgent.executeAction(${JSON.stringify(action)});
      global.nodeOutputs['${node.id}'] = { result };
    } catch (error) {
      console.error('AI Action failed:', error);
      throw error;
    }
  `;
};

export const processAIBrowserActionNode = (node: FlowNodeWithData) => {
  const action = node.data.settings?.action || '';
  
  return `
    // AI Browser Action: ${action}
    console.log('Executing AI browser action:', ${JSON.stringify(action)});
    try {
      const result = await global.aiBrowserAgent.executeAction(${JSON.stringify(action)});
      global.nodeOutputs['${node.id}'] = { result };
    } catch (error) {
      console.error('AI Browser Action failed:', error);
      throw error;
    }
  `;
};
