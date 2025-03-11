
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

export const processAIAgentNode = (node: FlowNodeWithData) => {
  const agentId = node.data.settings?.agentId || '';
  const description = node.data.settings?.description || '';
  
  return `
    // AI Agent: ${description}
    console.log('Executing AI agent with ID:', ${JSON.stringify(agentId)});
    try {
      // First, fetch the agent script from the database
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('script')
        .eq('id', ${JSON.stringify(agentId)})
        .single();
        
      if (agentError) throw new Error(\`Failed to fetch agent: \${agentError.message}\`);
      if (!agentData.script) throw new Error('Agent has no script defined');
      
      // Execute the agent's script in the context of browser-use
      const result = await browser.evaluateScript(agentData.script);
      global.nodeOutputs['${node.id}'] = { result };
    } catch (error) {
      console.error('AI Agent execution failed:', error);
      throw error;
    }
  `;
};
