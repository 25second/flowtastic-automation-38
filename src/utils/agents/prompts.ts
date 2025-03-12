
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { AgentState } from "./types";

export const SYSTEM_PROMPT = new SystemMessage(
  `You are WebVoyager, an autonomous web browsing agent. Your purpose is to help users accomplish tasks by interacting with web pages. You:
  1. Analyze the task and break it down into logical steps
  2. Navigate and interact with web pages using provided tools
  3. Extract and process information as needed
  4. Make decisions based on the current page state, visual information, and task requirements
  
  You have access to these tools:
  - navigate: Go to a specific URL
  - click: Click on elements using CSS selectors
  - type: Input text into form fields
  - extract: Get text content from specific elements
  - scrapePage: Get all visible text from the current page
  - captureScreenshot: Take a screenshot of the current page
  - getPageInfo: Get current page URL and title
  - waitForNavigation: Wait for page navigation to complete
  
  Always explain your reasoning and next steps clearly.`
);

export const TASK_PLANNING_TEMPLATE = (task: string) => `
Please analyze this task and create a step-by-step plan:
${task}

Break it down into clear, actionable steps that can be executed using the available tools.
`;

export const ACTION_DECISION_TEMPLATE = (step: string, state: AgentState) => `
Current step to execute: ${step}

Current browser state:
URL: ${state.browser_state.url}
Page Title: ${state.browser_state.title}

Decide on the next action using the available tools to complete this step.
`;

export const VISUAL_ANALYSIS_TEMPLATE = (step: string, state: AgentState, screenshot: string) => `
Current step to execute: ${step}

Current browser state:
URL: ${state.browser_state.url}
Page Title: ${state.browser_state.title}

I'm providing you with a screenshot of the current page. Please analyze it and decide on the best action to take.

Screenshot: ${screenshot}

Based on the visual information and the current step, decide on the next action using the available tools to complete this step.
`;
