
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
    
    // Attempt to connect with various endpoint URL formats
    const endpoints = [
      `ws://127.0.0.1:${context.browserPort}`,
      `ws://localhost:${context.browserPort}`,
      `ws://127.0.0.1:${context.browserPort}/devtools/browser`,
      `http://127.0.0.1:${context.browserPort}`
    ];
    
    let lastError = null;
    let browser = null;
    
    // Try each endpoint until one works
    for (const endpointURL of endpoints) {
      try {
        console.log('Attempting to connect to browser with endpoint URL:', endpointURL);
        
        // Connect to browser using Playwright with increased timeout
        browser = await chromium.connectOverCDP({
          endpointURL,
          timeout: 60000, // Increased timeout to 60 seconds
          wsTimeout: 60000
        });
        
        console.log('Successfully connected to browser using endpoint:', endpointURL);
        break; // Exit loop if connection is successful
      } catch (error) {
        console.warn(`Failed to connect using endpoint ${endpointURL}:`, error.message);
        lastError = error;
      }
    }
    
    if (!browser) {
      console.error('All connection attempts failed. Last error:', lastError);
      throw lastError || new Error('Failed to connect to browser');
    }
    
    const browserContext = await browser.newContext();
    console.log('Successfully created browser context');
    
    const page = await browserContext.newPage();
    console.log('Successfully created new page');
    
    // Setup error handling for page
    page.on('crash', () => console.error('Page crashed'));
    page.on('error', (err) => console.error('Page error:', err));
    
    console.groupEnd();
    return { browser, page };
  } catch (error) {
    console.error("Error initializing browser:", error);
    console.groupEnd();
    throw error;
  }
};
