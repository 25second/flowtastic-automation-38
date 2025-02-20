
import puppeteer from 'puppeteer-core';

export async function executeWorkflow(req, res) {
  console.log('Received workflow execution request');
  
  const { script, browserConnection, nodes, edges, serverId } = req.body;
  
  try {
    console.log(`Connecting to ${browserConnection.browserType} on port ${browserConnection.port}...`);
    console.log('WebSocket endpoint:', browserConnection.wsEndpoint);
    
    // Set browserConnection in global scope for script execution
    global.browserConnection = browserConnection;
    
    let browser;
    try {
      // Direct connection using the provided WebSocket endpoint
      browser = await puppeteer.connect({
        browserWSEndpoint: browserConnection.wsEndpoint,
        defaultViewport: null,
        // Add these options to handle potential connection issues
        protocolTimeout: 30000,
        transport: 'websocket'
      });
      
      console.log('Connected to browser successfully');
    } catch (error) {
      console.error('Browser connection error:', error);
      throw new Error(`Failed to connect to browser: ${error.message}`);
    }

    console.log('Executing workflow script...');
    
    // Execute the workflow script in context with browserConnection
    const context = {
      ...global,
      browserConnection,
      require: require
    };
    
    const scriptFunction = new Function('return ' + script)();
    const result = await scriptFunction.call(context);
    
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
