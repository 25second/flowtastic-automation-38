
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { AgentContext } from "./types";
import { getBrowserTools } from "./browser-tools";
import { getDefaultProvider } from "./llm-providers";
import { getPromptTemplates } from "./prompts";
import { Page } from "playwright";

export const initializeAgent = async (
  context: AgentContext,
  page: Page
) => {
  // Get LLM instance
  const { provider } = await getDefaultProvider();
  const llm = await provider.initialize(context.config);
  
  // Get browser tools
  const tools = getBrowserTools(page);
  
  // Get prompt templates
  const { SYSTEM_PROMPT } = getPromptTemplates();
  
  // Create agent with Web Voyager pattern
  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt: SYSTEM_PROMPT
  });
  
  const executor = await AgentExecutor.fromAgentAndTools({
    agent,
    tools,
    verbose: true,
    returnIntermediateSteps: true
  });
  
  return {
    executor,
    tools,
    llm
  };
};
