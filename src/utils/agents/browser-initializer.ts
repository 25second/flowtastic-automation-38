
import { chromium, Page, Browser } from "playwright";
import { AgentContext } from "./types";

/**
 * Initializes a browser instance for the agent
 */
export const initializeBrowser = async (
  context: AgentContext
): Promise<{ browser: Browser; page: Page }> => {
  try {
    // Connect to browser using Playwright
    const browser = await chromium.connectOverCDP({
      endpointURL: `ws://127.0.0.1:${context.browserPort}`,
      timeout: 30000
    });
    
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();
    
    return { browser, page };
  } catch (error) {
    console.error("Error initializing browser:", error);
    throw error;
  }
};
