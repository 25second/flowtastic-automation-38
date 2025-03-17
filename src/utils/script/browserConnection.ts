
export const generateBrowserConnectionCode = (browserPort?: number) => `
async function getBrowserWSEndpoint(port) {
  try {
    console.log('Attempting to discover WebSocket endpoint on port', port);
    
    // Try multiple endpoint discovery approaches
    const endpoints = [
      { url: \`http://127.0.0.1:\${port}/json/version\`, extractor: data => data.webSocketDebuggerUrl },
      { url: \`http://localhost:\${port}/json/version\`, extractor: data => data.webSocketDebuggerUrl },
      { url: \`http://127.0.0.1:\${port}/json\`, extractor: data => Array.isArray(data) && data.length > 0 ? data[0].webSocketDebuggerUrl : null },
      { url: \`http://localhost:\${port}/json\`, extractor: data => Array.isArray(data) && data.length > 0 ? data[0].webSocketDebuggerUrl : null },
      { url: \`http://127.0.0.1:\${port}/json/list\`, extractor: data => Array.isArray(data) && data.length > 0 ? data[0].webSocketDebuggerUrl : null },
      { url: \`http://localhost:\${port}/json/list\`, extractor: data => Array.isArray(data) && data.length > 0 ? data[0].webSocketDebuggerUrl : null },
    ];
    
    console.log('Testing', endpoints.length, 'different endpoint URLs');
    
    // Try each endpoint discovery method
    for (const endpoint of endpoints) {
      try {
        console.log('Trying', endpoint.url);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(endpoint.url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.log('Endpoint', endpoint.url, 'returned status', response.status);
          continue;
        }
        
        const data = await response.json();
        const wsUrl = endpoint.extractor(data);
        
        if (wsUrl) {
          console.log('Found WebSocket URL from', endpoint.url, ':', wsUrl);
          return wsUrl;
        }
      } catch (error) {
        console.log('Error fetching from', endpoint.url, ':', error.message);
      }
    }
    
    // Fallback to common endpoint patterns if discovery fails
    const fallbackEndpoints = [
      \`ws://127.0.0.1:\${port}/devtools/browser\`,
      \`ws://localhost:\${port}/devtools/browser\`,
      \`ws://127.0.0.1:\${port}\`,
      \`ws://localhost:\${port}\`
    ];
    
    console.log('Using fallback WebSocket URL:', fallbackEndpoints[0]);
    return fallbackEndpoints[0];
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
    
    // Try both wsEndpoint and endpointURL
    try {
      browser = await chromium.connectOverCDP({
        endpointURL: wsEndpoint,
        timeout: 60000,
        wsEndpoint
      });
    } catch (error) {
      console.log('First connection attempt failed:', error.message);
      console.log('Trying with alternative options...');
      
      browser = await chromium.connectOverCDP({
        endpointURL: wsEndpoint.replace('localhost', '127.0.0.1').replace('ws://', 'http://'),
        timeout: 60000
      });
    }

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
