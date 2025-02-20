
import puppeteer from 'puppeteer-core';

export async function executeWorkflow(req, res) {
  console.log('Received workflow execution request');
  
  const { script, browserConnection, nodes, edges, serverId } = req.body;
  
  try {
    console.log(`Connecting to ${browserConnection.browserType} on port ${browserConnection.port}...`);
    
    // Set browserConnection in global scope for script execution
    global.browserConnection = browserConnection;
    
    let browser;
    if (browserConnection.browserType === 'linkenSphere') {
      console.log(`Connecting to LinkenSphere session ${browserConnection.sessionId}`);
      const wsEndpoint = browserConnection.wsEndpoint;
      console.log('Using WebSocket endpoint:', wsEndpoint);
      
      browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint,
        defaultViewport: null,
      });
    } else {
      console.log('Connecting to Chrome browser');
      browser = await puppeteer.connect({
        browserWSEndpoint: `ws://127.0.0.1:${browserConnection.port}`,
        defaultViewport: null,
      });
    }

    console.log('Connected to browser successfully');
    console.log('Executing workflow script...');
    
    // Execute the workflow script
    const scriptFunction = new Function('return ' + script)();
    const result = await scriptFunction();
    
    console.log('Workflow execution completed:', result);
    
    await browser.disconnect();
    res.json({ 
      message: 'Workflow executed successfully',
      status: 'success',
      result 
    });
    
  } catch (error) {
    console.error('Workflow execution error:', error);
    res.status(500).json({ 
      error: 'Workflow execution failed: ' + error.message,
      status: 'error',
      details: error.stack
    });
  }
}
