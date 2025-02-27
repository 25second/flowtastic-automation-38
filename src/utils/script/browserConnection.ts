
export const generateBrowserConnectionCode = (browserPort?: number) => `
async function getBrowserWSEndpoint(port) {
  try {
    const versionResponse = await fetch(\`http://127.0.0.1:\${port}/json/version\`);
    if (versionResponse.ok) {
      const versionData = await versionResponse.json();
      if (versionData.webSocketDebuggerUrl) {
        console.log('Found WS endpoint from /json/version:', versionData.webSocketDebuggerUrl);
        return versionData.webSocketDebuggerUrl;
      }
    }

    const response = await fetch(\`http://127.0.0.1:\${port}/json\`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0 && data[0].webSocketDebuggerUrl) {
        console.log('Found WS endpoint from /json:', data[0].webSocketDebuggerUrl);
        return data[0].webSocketDebuggerUrl;
      }
    }

    const directWsUrl = \`ws://127.0.0.1:\${port}/devtools/browser\`;
    console.log('Using direct WS URL:', directWsUrl);
    return directWsUrl;
  } catch (error) {
    console.error('Error getting browser WebSocket endpoint:', error);
    return \`ws://127.0.0.1:\${port}/devtools/browser\`;
  }
}

async function connectToBrowser() {
  try {
    const port = ${browserPort || "YOUR_PORT"};
    const wsEndpoint = await getBrowserWSEndpoint(port);
    
    console.log('Attempting to connect to browser at:', wsEndpoint);
    
    browser = await chromium.connectOverCDP({
      endpointURL: wsEndpoint,
      timeout: 30000,
      wsEndpoint: wsEndpoint
    });

    console.log('Successfully connected to browser');
    
    const contexts = await browser.contexts();
    context = contexts[0] || await browser.newContext();
    const pages = await context.pages();
    page = pages[0] || await context.newPage();
    
    // Initialize pageStore with first page
    pageStore.setActivePage('initial', page);
    
    console.log('Successfully initialized context and page');
  } catch (error) {
    console.error('Failed to connect to browser:', error);
    throw error;
  }
}`;
