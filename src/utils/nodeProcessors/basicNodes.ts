
export const processStartNode = () => `
    // Initialize browser connection
    if (!browserConnection && !process.env.BROWSER_WS_ENDPOINT) {
      throw new Error('Browser connection information is missing. Please set BROWSER_WS_ENDPOINT environment variable.');
    }

    const wsEndpoint = browserConnection?.wsEndpoint || process.env.BROWSER_WS_ENDPOINT;
    console.log('Connecting to browser at:', wsEndpoint);

    try {
      global.browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint,
        defaultViewport: null
      });
      console.log('Successfully connected to browser');
    } catch (error) {
      console.error('Failed to connect to browser:', error);
      throw new Error('Failed to establish browser connection: ' + error.message);
    }`;

export const processEndNode = () => `
    // End workflow execution
    console.log('Ending workflow execution...');
    if (global.page) {
      await global.page.close();
    }`;

export const processSessionStopNode = () => `
    // Stop browser session
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
          }
        }
        
        // Disconnect from browser
        await global.browser.disconnect();
        console.log('Successfully disconnected from browser');
      }
    } catch (error) {
      console.log('Error during session stop:', error.message);
    }`;
