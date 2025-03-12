import { StateGraph, END } from "@langchain/langgraph";
import { RunnableLambda } from "@langchain/core/runnables";
import { supabase } from "@/integrations/supabase/client";
import { AgentState, AgentContext, AgentStep, AgentMessage } from "./types";
import { getSystemMessage, getTaskMessage, PLANNING_PROMPT } from "./prompts";
import { getLLMProvider, getDefaultProvider } from "./llm-providers";
import { getBrowserTools } from "./browser-tools";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { BaseMessage } from "@langchain/core/messages";
import { Agent } from "@/hooks/ai-agents/types";

// Browser interface
class BrowserInterface {
  private port: number;
  private sessionId: string;
  
  constructor(port: number, sessionId: string) {
    this.port = port;
    this.sessionId = sessionId;
  }
  
  async navigate(url: string) {
    console.log(`Navigating to ${url}`);
    // Implement actual navigation logic here
    return `Navigated to ${url}`;
  }
  
  async click(selector: string) {
    console.log(`Clicking ${selector}`);
    // Implement actual click logic here
    return `Clicked on ${selector}`;
  }
  
  async type(selector: string, text: string) {
    console.log(`Typing "${text}" into ${selector}`);
    // Implement actual typing logic here
    return `Typed "${text}" into ${selector}`;
  }
  
  async extract(selector: string) {
    console.log(`Extracting content from ${selector}`);
    // Implement actual extraction logic here
    return "Extracted content would be here";
  }
  
  async waitForSelector(selector: string, timeout = 30000) {
    console.log(`Waiting for ${selector}`);
    // Implement actual wait logic here
    return `Waited for ${selector}`;
  }
  
  async screenshot() {
    console.log(`Taking screenshot`);
    // Implement actual screenshot logic here
    return "base64-encoded-screenshot-data";
  }
}

// Convert LangChain messages to AgentMessages
function convertToAgentMessages(messages: BaseMessage[]): AgentMessage[] {
  return messages.map(msg => ({
    role: msg._getType() as any,
    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
    name: 'name' in msg ? (msg as any).name : undefined
  }));
}

// Node functions for the state graph
async function createInitialState(context: AgentContext): Promise<AgentState> {
  const systemMessage = getSystemMessage();
  const taskMessage = getTaskMessage(context.userTask);
  
  return {
    messages: [
      {
        role: 'system',
        content: systemMessage.content as string
      },
      {
        role: 'user',
        content: taskMessage.content as string
      }
    ],
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

async function planTask(state: AgentState, context: AgentContext): Promise<AgentState> {
  try {
    // Get the LLM model
    const { config, provider } = await getDefaultProvider();
    const model = await provider.initialize(config);
    
    // Create planning prompt
    const messages = [
      getSystemMessage(),
      getTaskMessage(state.task),
      { 
        type: "human", 
        content: PLANNING_PROMPT 
      }
    ];
    
    // Generate plan
    const response = await model.invoke(messages);
    const plan = response.content as string;
    
    // Parse the steps from the plan
    const steps = parsePlanIntoSteps(plan);
    
    return {
      ...state,
      steps,
      status: 'planning',
      messages: [
        ...state.messages,
        {
          role: 'assistant',
          content: plan
        }
      ]
    };
  } catch (error: any) {
    console.error("Error in planning task:", error);
    return {
      ...state,
      status: 'error',
      error: error.message,
      messages: [
        ...state.messages,
        {
          role: 'function',
          content: `Error in planning: ${error.message}`,
          name: "error"
        }
      ]
    };
  }
}

function parsePlanIntoSteps(planText: string): AgentStep[] {
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

async function executeStep(state: AgentState, context: AgentContext): Promise<AgentState> {
  if (state.current_step >= state.steps.length) {
    return { ...state, status: 'completed' };
  }
  
  const currentStep = state.steps[state.current_step];
  
  try {
    // Update step status
    const updatedSteps = [...state.steps];
    updatedSteps[state.current_step] = { ...currentStep, status: 'in_progress' };
    
    // Get the LLM model
    const { config, provider } = await getDefaultProvider();
    const model = await provider.initialize(config);
    
    // Create browser interface
    const browser = new BrowserInterface(context.browserPort, context.sessionId);
    
    // Create tools
    const saveScreenshot = async (data: string) => {
      // Implementation to save screenshot
      const { data: uploadData, error } = await supabase.storage
        .from('screenshots')
        .upload(`${context.sessionId}/${Date.now()}.png`, data, {
          contentType: 'image/png',
          upsert: true
        });
      
      if (error) throw error;
      return uploadData.path;
    };
    
    const tools = getBrowserTools(browser, saveScreenshot, context.tableId, supabase);
    
    // Execute step using agent
    const result = { output: `Executed step: ${currentStep.description}` };
    
    // Here you would use LangChain's agent executor - simplified for now
    // const agentExecutor = await initializeAgentExecutor(model, tools, currentStep.description);
    // const result = await agentExecutor.invoke({ input: currentStep.description });
    
    // Update step with result
    updatedSteps[state.current_step] = { 
      ...currentStep, 
      status: 'completed', 
      result: result.output 
    };
    
    // Take a screenshot if enabled
    let screenshot = undefined;
    if (context.takeScreenshots) {
      try {
        const screenshotData = await browser.screenshot();
        screenshot = await saveScreenshot(screenshotData);
        updatedSteps[state.current_step].screenshot = screenshot;
      } catch (error) {
        console.error("Error taking screenshot:", error);
      }
    }
    
    return {
      ...state,
      steps: updatedSteps,
      current_step: state.current_step + 1,
      status: 'executing',
      messages: [...state.messages, { 
        role: "assistant", 
        content: `Step ${state.current_step + 1}: ${currentStep.description}\nResult: ${result.output}` 
      }],
      screenshot
    };
  } catch (error: any) {
    console.error("Error executing step:", error);
    
    // Mark step as failed
    const updatedSteps = [...state.steps];
    updatedSteps[state.current_step] = { 
      ...currentStep, 
      status: 'failed', 
      result: `Error: ${error.message}` 
    };
    
    return {
      ...state,
      steps: updatedSteps,
      status: 'error',
      error: error.message,
      messages: [...state.messages, { 
        role: "function", 
        content: `Error executing step ${state.current_step + 1}: ${error.message}`, 
        name: "error" 
      }]
    };
  }
}

function shouldContinue(state: AgentState): "continue" | "complete" | "error" {
  if (state.status === 'error') {
    return "error";
  }
  
  if (state.status === 'completed' || state.current_step >= state.steps.length) {
    return "complete";
  }
  
  return "continue";
}

export class WebAutomationAgent {
  private context: AgentContext;
  private workflow: any;
  
  constructor(context: AgentContext) {
    this.context = context;
    this.workflow = this.buildWorkflow();
  }
  
  private buildWorkflow() {
    // This is a simplified implementation for now
    // In a full implementation, we would use StateGraph from LangGraph correctly
    
    const execute = async (state: AgentState = {} as any) => {
      try {
        // Initialize state
        let currentState = await createInitialState(this.context);
        
        // Plan task
        currentState = await planTask(currentState, this.context);
        
        // Execute steps
        while (currentState.current_step < currentState.steps.length && currentState.status !== 'error') {
          currentState = await executeStep(currentState, this.context);
        }
        
        // Set final status
        if (currentState.status !== 'error') {
          currentState.status = 'completed';
        }
        
        return currentState;
      } catch (error: any) {
        return {
          status: 'error',
          error: error.message,
          steps: [],
          messages: [],
          task: this.context.userTask,
          current_step: 0,
          browser_state: { url: '', title: '', isNavigating: false, elements: [] },
          memory: {}
        };
      }
    };
    
    return { invoke: execute };
  }
  
  async run() {
    try {
      const result = await this.workflow.invoke({});
      return result;
    } catch (error: any) {
      console.error("Error running agent workflow:", error);
      toast.error(`Agent execution failed: ${error.message}`);
      return {
        status: 'error',
        error: error.message
      };
    }
  }
  
  async updateAgentStatus(agentId: string, status: string) {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ status })
        .eq('id', agentId);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error updating agent status:", error);
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
    // Get agent configuration from database
    const { data: agentData, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();
      
    if (agentError) throw agentError;
    
    // Update agent status to running
    await supabase
      .from('agents')
      .update({ status: 'running' })
      .eq('id', agentId);
    
    // Get provider for the agent (using ai_provider property if available)
    // Safely access ai_provider property which might not exist in old records
    const providerId = agentData && 'ai_provider' in agentData ? 
      (agentData.ai_provider as string) : null;
      
    const { config, provider } = providerId 
      ? await getLLMProvider(providerId) 
      : await getDefaultProvider();
    
    // Create agent context
    const context: AgentContext = {
      userTask: task || (agentData?.task_description as string) || '',
      sessionId,
      browserPort,
      // Safely access table_id property which might not exist in old records
      tableId: agentData && 'table_id' in agentData ? 
        (agentData.table_id as string) : undefined,
      takeScreenshots: agentData?.take_screenshots || false,
      config
    };
    
    // Initialize and run agent
    const agent = new WebAutomationAgent(context);
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
