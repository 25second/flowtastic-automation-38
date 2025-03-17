
import { supabase } from "@/integrations/supabase/client";
import { WebVoyagerAgent } from "./WebVoyagerAgent";
import { AgentContext, AgentData } from "./types";
import { getDefaultProvider } from "./llm-providers";
import { toast } from "sonner";

export const startAgent = async (
  agentId: string,
  task: string,
  sessionId: string,
  browserPort: number
) => {
  try {
    // Get agent configuration
    const { data: agentData, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();
      
    if (agentError) throw agentError;

    // Ensure we're treating the data as AgentData type
    const agent = agentData as AgentData;
    
    // Update agent status
    await supabase
      .from('agents')
      .update({ status: 'running' })
      .eq('id', agentId);
    
    // Get provider configuration
    const providerId = agent.ai_provider || null;
    const { config } = providerId 
      ? await getDefaultProvider()
      : await getDefaultProvider();
    
    // Create and run agent
    const context: AgentContext = {
      userTask: task || agent.task_description || '',
      sessionId,
      browserPort,
      tableId: agent.table_id, // Используем table_id вместо category_id
      takeScreenshots: agent.take_screenshots || false,
      config
    };
    
    const webVoyagerAgent = new WebVoyagerAgent(context);
    const result = await webVoyagerAgent.run();
    
    // Update agent status based on result
    await supabase
      .from('agents')
      .update({ 
        status: result.status === 'error' ? 'error' : 'completed'
      })
      .eq('id', agentId);
    
    return result;
    
  } catch (error: any) {
    console.error("Error starting agent:", error);
    
    // Update agent status to error
    await supabase
      .from('agents')
      .update({ status: 'error' })
      .eq('id', agentId);
    
    throw error;
  }
};
