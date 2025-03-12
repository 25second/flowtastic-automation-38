
import { AgentContext, AgentState, AgentStep } from "./types";
import { Page } from "playwright";
import { saveScreenshot } from "./screenshot-manager";
import { getPromptTemplates } from "./prompts";

/**
 * Executes a single step in the agent's plan
 */
export const executeStep = async (
  step: AgentStep,
  state: AgentState,
  page: Page,
  executor: any,
  context: AgentContext
): Promise<void> => {
  try {
    step.status = 'in_progress';
    
    // Update browser state
    state.browser_state.url = page.url();
    state.browser_state.title = await page.title();
    
    // Take screenshot if enabled
    let screenshot = null;
    if (context.takeScreenshots) {
      const screenshotTool = executor.tools.find((tool: any) => tool.name === 'captureScreenshot');
      if (screenshotTool) {
        screenshot = await screenshotTool._call({});
      }
    }
    
    // Get prompt templates
    const { ACTION_DECISION_TEMPLATE, VISUAL_ANALYSIS_TEMPLATE } = getPromptTemplates();
    
    // Execute step with or without visual information
    let actionResult;
    if (screenshot) {
      actionResult = await executor.invoke({
        input: VISUAL_ANALYSIS_TEMPLATE(step.description, state, screenshot)
      });
    } else {
      actionResult = await executor.invoke({
        input: ACTION_DECISION_TEMPLATE(step.description, state)
      });
    }
    
    step.status = 'completed';
    step.result = actionResult.output;
    
    // Save screenshot to database if enabled
    if (context.takeScreenshots && screenshot) {
      step.screenshot = await saveScreenshot(screenshot, context.sessionId);
    }
    
  } catch (error: any) {
    step.status = 'failed';
    step.result = `Error: ${error.message}`;
    throw error;
  }
};

/**
 * Executes the agent's planning phase
 */
export const executePlanningPhase = async (
  executor: any,
  context: AgentContext
): Promise<string> => {
  const { TASK_PLANNING_TEMPLATE } = getPromptTemplates();
  
  const planResult = await executor.invoke({
    input: TASK_PLANNING_TEMPLATE(context.userTask)
  });
  
  return planResult.output;
};
