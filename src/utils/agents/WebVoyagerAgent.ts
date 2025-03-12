
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { AgentState, AgentContext } from "./types";
import { getBrowserTools } from "./browser-tools";
import { getDefaultProvider } from "./llm-providers";
import { supabase } from "@/integrations/supabase/client";
import { getPromptTemplates } from "./prompts";
import { parsePlanIntoSteps } from "./plan-parser";
import { initializeBrowser } from "./browser-initializer";
import { executeStep, executePlanningPhase } from "./agent-executor";

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
      const browserInit = await initializeBrowser(this.context);
      this.browser = browserInit.browser;
      this.page = browserInit.page;
      
      // Update browser state
      this.state.browser_state.url = this.page.url();
      this.state.browser_state.title = await this.page.title();
      
      // Get LLM instance
      const { provider } = await getDefaultProvider();
      this.llm = await provider.initialize(this.context.config);
      
      // Get browser tools
      this.tools = getBrowserTools(this.page);
      
      // Get prompt templates
      const { SYSTEM_PROMPT } = getPromptTemplates();
      
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
      const planOutput = await executePlanningPhase(this.executor, this.context);
      
      const steps = parsePlanIntoSteps(planOutput);
      this.state.steps = steps;
      
      // Execution phase
      this.state.status = 'executing';
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (this.state.status === 'error') break;
        
        try {
          this.state.current_step = i;
          await executeStep(step, this.state, this.page, this.executor, this.context);
        } catch (error: any) {
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
  
  async stop() {
    try {
      await this.page?.close();
      await this.browser?.close();
    } catch (error) {
      console.error("Error stopping agent:", error);
    }
  }
}
