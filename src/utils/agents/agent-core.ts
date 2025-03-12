
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
  ACTION_DECISION_TEMPLATE,
  VISUAL_ANALYSIS_TEMPLATE
} from "./prompts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export class WebVoyagerAgent {
  private context: AgentContext;
  private state: AgentState;
  private browser: any;
  private page: any;
  private llm: any;
  private tools: any[];
  private executor: any;
  
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
    this.tools = [];
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
      
      // Update browser state
      this.state.browser_state.url = this.page.url();
      this.state.browser_state.title = await this.page.title();
      
      // Get LLM instance
      const { provider } = await getDefaultProvider();
      this.llm = await provider.initialize(this.context.config);
      
      // Get browser tools
      this.tools = getBrowserTools(this.page);
      
      // Create agent with Web Voyager pattern
      const agent = await createOpenAIFunctionsAgent({
        llm: this.llm,
        tools: this.tools,
        prompt: SYSTEM_PROMPT
      });
      
      this.executor = await AgentExecutor.fromAgentAndTools({
        agent,
        tools: this.tools,
        verbose: true,
        returnIntermediateSteps: true
      });
      
      return this.executor;
      
    } catch (error) {
      console.error("Error initializing agent:", error);
      throw error;
    }
  }
  
  async run() {
    try {
      await this.initialize();
      
      // Planning phase
      this.state.status = 'planning';
      const planResult = await this.executor.invoke({
        input: TASK_PLANNING_TEMPLATE(this.context.userTask)
      });
      
      const steps = this.parsePlanIntoSteps(planResult.output);
      this.state.steps = steps;
      
      // Execution phase
      this.state.status = 'executing';
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (this.state.status === 'error') break;
        
        try {
          step.status = 'in_progress';
          this.state.current_step = i;
          
          // Update browser state
          this.state.browser_state.url = this.page.url();
          this.state.browser_state.title = await this.page.title();
          
          // Take screenshot if enabled
          let screenshot = null;
          if (this.context.takeScreenshots) {
            const screenshotTool = this.tools.find(tool => tool.name === 'captureScreenshot');
            if (screenshotTool) {
              screenshot = await screenshotTool._call({});
            }
          }
          
          // Execute step with or without visual information
          let actionResult;
          if (screenshot) {
            actionResult = await this.executor.invoke({
              input: VISUAL_ANALYSIS_TEMPLATE(step.description, this.state, screenshot)
            });
          } else {
            actionResult = await this.executor.invoke({
              input: ACTION_DECISION_TEMPLATE(step.description, this.state)
            });
          }
          
          step.status = 'completed';
          step.result = actionResult.output;
          
          // Save screenshot to database if enabled
          if (this.context.takeScreenshots && screenshot) {
            const base64Data = screenshot.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            
            const { data: uploadData, error } = await supabase.storage
              .from('screenshots')
              .upload(`${this.context.sessionId}/${Date.now()}.jpg`, buffer, {
                contentType: 'image/jpeg',
                upsert: true
              });
              
            if (!error && uploadData) {
              step.screenshot = uploadData.path;
            }
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
    const providerId = agentData?.ai_provider || null;
    const { config } = providerId 
      ? await getDefaultProvider()
      : await getDefaultProvider();
    
    // Create and run agent
    const context: AgentContext = {
      userTask: task || agentData?.task_description || '',
      sessionId,
      browserPort,
      tableId: agentData?.table_id || undefined,
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
