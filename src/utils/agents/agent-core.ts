import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { chromium } from "playwright";
import { RunnableSequence } from "@langchain/core/runnables";
import { AgentState, AgentContext, AgentStep } from "./types";
import { getBrowserTools } from "./browser-tools";
import { getDefaultProvider } from "./llm-providers";
import { 
  SYSTEM_PROMPT, 
  TASK_PLANNING_TEMPLATE,
  ACTION_DECISION_TEMPLATE 
} from "./prompts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export class WebVoyagerAgent {
  private context: AgentContext;
  private state: AgentState;
  private browser: any;
  private page: any;
  
  constructor(context: AgentContext) {
    this.context = context;
    this.state = {
      messages: [],
      task: context.userTask,
      steps: [],
      current_step: 0,
      status: 'idle',
      browser_state: {
        url: '',
        title: '',
        isNavigating: false,
        elements: []
      },
      memory: {}
    };
  }
  
  async initialize() {
    try {
      // Connect to browser using Playwright
      this.browser = await chromium.connectOverCDP({
        endpointURL: `ws://127.0.0.1:${this.context.browserPort}`,
        timeout: 30000
      });
      
      const context = await this.browser.newContext();
      this.page = await context.newPage();
      
      // Get LLM instance
      const { provider } = await getDefaultProvider();
      const model = await provider.initialize(this.context.config);
      
      // Get browser tools
      const tools = getBrowserTools(this.page);
      
      // Create agent with Web Voyager pattern
      const agent = await createOpenAIFunctionsAgent({
        llm: model,
        tools,
        systemMessage: SYSTEM_PROMPT
      });
      
      return await AgentExecutor.fromAgentAndTools({
        agent,
        tools,
        verbose: true
      });
      
    } catch (error) {
      console.error("Error initializing agent:", error);
      throw error;
    }
  }
  
  async run() {
    try {
      const executor = await this.initialize();
      
      // Planning phase
      this.state.status = 'planning';
      const planResult = await executor.invoke({
        input: TASK_PLANNING_TEMPLATE(this.context.userTask)
      });
      
      const steps = this.parsePlanIntoSteps(planResult.output);
      this.state.steps = steps;
      
      // Execution phase
      this.state.status = 'executing';
      for (const step of steps) {
        if (this.state.status === 'error') break;
        
        try {
          step.status = 'in_progress';
          
          const actionResult = await executor.invoke({
            input: ACTION_DECISION_TEMPLATE(step.description, this.state)
          });
          
          step.status = 'completed';
          step.result = actionResult.output;
          
          // Take screenshot if enabled
          if (this.context.takeScreenshots) {
            const screenshot = await this.page.screenshot();
            const { data: uploadData } = await supabase.storage
              .from('screenshots')
              .upload(`${this.context.sessionId}/${Date.now()}.png`, screenshot, {
                contentType: 'image/png',
                upsert: true
              });
              
            step.screenshot = uploadData?.path;
          }
          
        } catch (error: any) {
          step.status = 'failed';
          step.result = `Error: ${error.message}`;
          this.state.status = 'error';
          this.state.error = error.message;
        }
      }
      
      if (this.state.status !== 'error') {
        this.state.status = 'completed';
      }
      
      return this.state;
      
    } catch (error: any) {
      console.error("Error running agent:", error);
      this.state.status = 'error';
      this.state.error = error.message;
      return this.state;
    }
  }
  
  private parsePlanIntoSteps(planText: string): AgentStep[] {
    // Simple regex to extract numbered steps
    const stepRegex = /(\d+)[.)\s]+(.+?)(?=\s*\d+[.)\s]+|$)/gs;
    const steps: AgentStep[] = [];
    
    let match;
    while ((match = stepRegex.exec(planText)) !== null) {
      const stepDescription = match[2].trim();
      steps.push({
        id: uuidv4(),
        description: stepDescription,
        status: 'pending'
      });
    }
    
    // If no steps were parsed, create a single step with the entire text
    if (steps.length === 0 && planText.trim()) {
      steps.push({
        id: uuidv4(),
        description: planText.trim(),
        status: 'pending'
      });
    }
    
    return steps;
  }
  
  async stop() {
    try {
      await this.page?.close();
      await this.browser?.close();
    } catch (error) {
      console.error("Error stopping agent:", error);
    }
  }
}

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
    
    // Update agent status
    await supabase
      .from('agents')
      .update({ status: 'running' })
      .eq('id', agentId);
    
    // Get provider configuration
    const providerId = agentData?.ai_provider;
    const { config } = providerId 
      ? await getDefaultProvider()
      : await getDefaultProvider();
    
    // Create and run agent
    const context: AgentContext = {
      userTask: task || agentData?.task_description || '',
      sessionId,
      browserPort,
      tableId: agentData?.table_id,
      takeScreenshots: agentData?.take_screenshots || false,
      config
    };
    
    const agent = new WebVoyagerAgent(context);
    const result = await agent.run();
    
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
