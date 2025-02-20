
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

export const processSessionStopNode = () => `
    // Stop LinkSphere session
    console.log('Stopping session...');
    if (global.page) {
      await global.page.close();
    }
    if (global.browser) {
      await global.browser.disconnect();
    }`;
