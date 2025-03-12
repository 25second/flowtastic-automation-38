
import { StateGraph, END } from "@langchain/langgraph";
import { RunnableLambda } from "@langchain/core/runnables";
import { supabase } from "@/integrations/supabase/client";
import { AgentState, AgentContext, AgentStep } from "./types";
import { getSystemMessage, getTaskMessage, PLANNING_PROMPT } from "./prompts";
import { getLLMProvider, getDefaultProvider } from "./llm-providers";
import { getBrowserTools } from "./browser-tools";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Browser interface
class BrowserInterface {
  private port: number;
  private sessionId: string;
  
  constructor(port: number, sessionId: string) {
    this.port = port;
    this.sessionId = sessionId;
  }
  
  async navigate(url: string) {
    // Implement browser navigation logic
    console.log(`Navigating to ${url}`);
    // Add actual implementation
  }
  
  async click(selector: string) {
    // Implement click logic
    console.log(`Clicking ${selector}`);
    // Add actual implementation
  }
  
  async type(selector: string, text: string) {
    // Implement typing logic
    console.log(`Typing "${text}" into ${selector}`);
    // Add actual implementation
  }
  
  async extract(selector: string) {
    // Implement extraction logic
    console.log(`Extracting content from ${selector}`);
    // Add actual implementation
    return "Extracted content would be here";
  }
  
  async waitForSelector(selector: string) {
    // Implement wait logic
    console.log(`Waiting for ${selector}`);
    // Add actual implementation
  }
  
  async screenshot() {
    // Implement screenshot logic
    console.log(`Taking screenshot`);
    // Add actual implementation
    return "base64-encoded-screenshot-data";
  }
}

// Node functions for the state graph
async function createInitialState(context: AgentContext): Promise<AgentState> {
  return {
    messages: [
      getSystemMessage().content,
      getTaskMessage(context.userTask).content
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
      { role: "user", content: PLANNING_PROMPT }
    ];
    
    // Generate plan
    const response = await model.invoke(messages);
    const plan = response.content;
    
    // Parse the steps from the plan
    const steps = parsePlanIntoSteps(plan);
    
    return {
      ...state,
      steps,
      status: 'planning',
      messages: [...state.messages, { role: "assistant", content: plan }]
    };
  } catch (error) {
    console.error("Error in planning task:", error);
    return {
      ...state,
      status: 'error',
      messages: [...state.messages, { role: "function", content: `Error in planning: ${error.message}`, name: "error" }]
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
    
    // Execute step using LLM and tools
    const agentExecutor = await initializeAgentExecutor(model, tools, currentStep.description);
    const result = await agentExecutor.invoke({ input: currentStep.description });
    
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
  } catch (error) {
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
      messages: [...state.messages, { 
        role: "function", 
        content: `Error executing step ${state.current_step + 1}: ${error.message}`, 
        name: "error" 
      }]
    };
  }
}

async function initializeAgentExecutor(model: any, tools: any[], task: string) {
  // Use LangChain's agent executor with the provided tools
  // This is a simplified version - in real implementation you'd use proper agent construction
  const { createOpenAIFunctionsAgent, AgentExecutor } = await import("langchain/agents");
  
  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools,
    prompt: `You are an autonomous web agent that helps users accomplish tasks in a web browser.
Your current task is: ${task}
Break this down into steps and execute them using the tools available to you.`
  });
  
  return new AgentExecutor({
    agent,
    tools,
    verbose: true
  });
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
    // Create state graph
    const workflow = new StateGraph<AgentState>({
      channels: ["messages", "task", "steps", "current_step", "status", "browser_state", "memory", "screenshot"]
    });
    
    // Add nodes
    workflow.addNode("initialize", new RunnableLambda({ 
      func: (state: AgentState) => createInitialState(this.context) 
    }));
    
    workflow.addNode("plan", new RunnableLambda({ 
      func: (state: AgentState) => planTask(state, this.context) 
    }));
    
    workflow.addNode("execute", new RunnableLambda({ 
      func: (state: AgentState) => executeStep(state, this.context) 
    }));
    
    // Add edges
    workflow.addEdge("initialize", "plan");
    workflow.addEdge("plan", "execute");
    
    // Conditional edge from execute
    workflow.addConditionalEdges(
      "execute",
      shouldContinue,
      {
        "continue": "execute",
        "complete": END,
        "error": END
      }
    );
    
    // Set entry point
    workflow.setEntryPoint("initialize");
    
    return workflow.compile();
  }
  
  async run() {
    try {
      const result = await this.workflow.invoke({});
      return result;
    } catch (error) {
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
    
    // Get provider for the agent
    const providerId = agentData.ai_provider || null;
    const { config, provider } = providerId 
      ? await getLLMProvider(providerId) 
      : await getDefaultProvider();
    
    // Create agent context
    const context: AgentContext = {
      userTask: task || agentData.task_description,
      sessionId,
      browserPort,
      tableId: agentData.table_id,
      takeScreenshots: agentData.take_screenshots || false,
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
  } catch (error) {
    console.error("Error starting agent:", error);
    
    // Update agent status to error
    await supabase
      .from('agents')
      .update({ status: 'error' })
      .eq('id', agentId);
    
    throw error;
  }
};
