
export const generateBrowserConnectionCode = (browserPort?: number) => {
  return `
async function connectToBrowser() {
  const port = ${browserPort || 'process.env.BROWSER_PORT'};
  
  if (!port) {
    throw new Error('Browser port is not specified. Please provide a valid port.');
  }
  
  const wsEndpoint = \`ws://127.0.0.1:\${port}\`;
  console.log('Connecting to browser at:', wsEndpoint);
  
  try {
    browser = await chromium.connectOverCDP(wsEndpoint);
    context = browser.contexts()[0];
    
    if (!context) {
      context = await browser.newContext();
    }
    
    const pages = await context.pages();
    page = pages.length > 0 ? pages[0] : await context.newPage();
    
    console.log('Successfully connected to browser');
    return { browser, context, page };
  } catch (error) {
    console.error('Failed to connect to browser:', error);
    throw new Error('Failed to establish browser connection: ' + error.message);
  }
}`;
};
