
import { chromium, Page, Browser } from "playwright";
import { AgentContext } from "./types";

/**
 * Initializes a browser instance for the agent
 */
export const initializeBrowser = async (
  context: AgentContext
): Promise<{ browser: Browser; page: Page }> => {
  console.group('Browser Initialization');
  try {
    console.log('Browser initialization context:', {
      browserPort: context.browserPort,
      sessionId: context.sessionId
    });
    
    // Check if port is valid
    if (!context.browserPort) {
      throw new Error('Browser port is missing or invalid');
    }
    
    const endpointURL = `ws://127.0.0.1:${context.browserPort}`;
    console.log('Connecting to browser with endpoint URL:', endpointURL);
    
    // Connect to browser using Playwright
    const browser = await chromium.connectOverCDP({
      endpointURL,
      timeout: 30000
    });
    
    console.log('Successfully connected to browser');
    
    const browserContext = await browser.newContext();
    console.log('Successfully created browser context');
    
    const page = await browserContext.newPage();
    console.log('Successfully created new page');
    
    console.groupEnd();
    return { browser, page };
  } catch (error) {
    console.error("Error initializing browser:", error);
    console.groupEnd();
    throw error;
  }
};
