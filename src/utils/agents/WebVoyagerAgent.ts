import { AgentState, AgentContext } from "./types";
import { initializeBrowser } from "./browser-initializer";
import { initializeAgent } from "./agent-initializer";
import { executeStep, executePlanningPhase } from "./agent-executor";
import { parsePlanIntoSteps } from "./plan-parser";

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
      
      // Initialize agent and tools
      const { executor, tools, llm } = await initializeAgent(this.context, this.page);
      this.executor = executor;
      this.tools = tools;
      this.llm = llm;
      
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
