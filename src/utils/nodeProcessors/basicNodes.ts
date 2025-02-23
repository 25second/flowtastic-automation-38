
import { FlowNodeWithData } from '@/types/flow';

export const processStartNode = () => `
    // Initialize browser connection
    console.log('Initializing browser connection...');
    const browser = await puppeteer.connect({
      browserWSEndpoint: browserConnection.wsEndpoint,
      defaultViewport: null
    });
    global.browser = browser;`;

export const processEndNode = () => `
    // End workflow execution
    console.log('Ending workflow execution...');
    if (global.page) {
      await global.page.close();
    }`;

export const processSessionStopNode = (_node: FlowNodeWithData) => `
    // Stop LinkSphere session
    console.log('Stopping session...');
    try {
      if (global.browser) {
        const pages = await global.browser.pages();
        console.log('Remaining open pages:', pages.length);
        
        // Safely close any remaining pages
        for (const page of pages) {
          try {
            await page.close();
          } catch (error) {
            console.log('Error closing page:', error.message);
            // Continue with other pages even if one fails
          }
        }
        
        // Disconnect from browser
        await global.browser.disconnect();
        console.log('Successfully disconnected from browser');
      }
    } catch (error) {
      console.log('Error during session stop:', error.message);
      // We consider this a non-fatal error since the session will be stopped by the server anyway
    }`;
