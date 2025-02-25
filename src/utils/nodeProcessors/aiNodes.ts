
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
