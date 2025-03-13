
import { AgentState, AgentContext, AgentStep } from "./types";
import { Page } from "playwright";
import { AgentExecutor } from "langchain/agents";
import { saveScreenshot } from "./screenshot-manager";

/**
 * Executes a single step of the agent's plan
 */
export const executeStep = async (
  step: AgentStep,
  state: AgentState,
  page: Page,
  executor: AgentExecutor,
  context: AgentContext
) => {
  try {
    console.log(`Executing step: ${step.description}`);
    step.status = 'in_progress'; // Changed from 'executing' to 'in_progress' to match type
    
    // Create input for the agent
    const input = {
      task: context.userTask,
      current_step: step.description,
      browser_state: state.browser_state,
      memory: state.memory
    };
    
    // Run the agent on this step
    const result = await executor.invoke({ input: JSON.stringify(input) });
    
    // Take a screenshot if enabled
    if (context.takeScreenshots) {
      const screenshot = await page.screenshot({ type: 'jpeg', quality: 80, fullPage: true });
      const screenshotPath = await saveScreenshot(
        `data:image/jpeg;base64,${screenshot.toString('base64')}`,
        context.sessionId
      );
      
      if (screenshotPath) {
        step.screenshot = screenshotPath;
      }
    }
    
    // Update the state
    state.browser_state.url = page.url();
    state.browser_state.title = await page.title();
    
    // Add the step result to the message history
    state.messages.push({
      role: 'assistant', // Changed from 'agent' to 'assistant' to match allowed roles
      content: result.output
    });
    
    step.status = 'completed';
    step.result = result.output;
    
    return result;
    
  } catch (error: any) {
    console.error(`Error executing step: ${error.message}`);
    step.status = 'failed'; // Changed from 'error' to 'failed' to match type
    step.result = `Error: ${error.message}`; // Store error message in result instead of non-existent error property
    throw error;
  }
};

/**
 * Executes the planning phase to generate a plan for the task
 */
export const executePlanningPhase = async (
  executor: AgentExecutor,
  context: AgentContext
) => {
  try {
    console.log('Executing planning phase');
    
    // Create input for planning
    const input = {
      task: context.userTask,
      phase: 'planning'
    };
    
    // Run the agent to create a plan
    const result = await executor.invoke({ input: JSON.stringify(input) });
    return result.output;
    
  } catch (error: any) {
    console.error(`Error in planning phase: ${error.message}`);
    throw error;
  }
};
