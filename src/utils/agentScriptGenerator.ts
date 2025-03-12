
export interface AgentScriptOptions {
  name: string;
  description?: string;
  taskDescription: string;
  takeScreenshots: boolean;
  selectedTable?: string;
  color?: string;
  aiProvider?: string;
  model?: string;
}

export const generateAgentScript = (options: AgentScriptOptions): string => {
  const {
    name,
    description,
    taskDescription,
    takeScreenshots,
    selectedTable,
    color,
    aiProvider,
    model
  } = options;

  return `// Agent: ${name}
// ${description || 'No description provided'}
// Generated: ${new Date().toISOString()}

import { startAgent } from "@/utils/agents/agent-core";

/**
 * This agent performs the following task:
 * ${taskDescription}
 */
export async function executeAgent(sessionId, browserPort) {
  try {
    // Configuration
    const config = {
      task: "${taskDescription.replace(/"/g, '\\"')}",
      takeScreenshots: ${takeScreenshots},
      ${selectedTable ? `tableId: "${selectedTable}",` : ''}
      provider: "${aiProvider || 'OpenAI'}",
      model: "${model || 'gpt-4o-mini'}"
    };
    
    // Start agent execution
    console.log("Starting agent execution with config:", config);
    
    const result = await startAgent(
      "{AGENT_ID}", 
      config.task, 
      sessionId, 
      browserPort
    );
    
    console.log("Agent execution completed with result:", result);
    return result;
  } catch (error) {
    console.error("Error executing agent:", error);
    throw error;
  }
}
`;
};
