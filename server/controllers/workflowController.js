
import puppeteer from 'puppeteer-core';

export async function executeWorkflow(req, res) {
  console.log('Received workflow execution request');
  
  const { script, browserConnection, nodes, edges, serverId } = req.body;
  
  try {
    console.log(`Connecting to ${browserConnection.browserType} on port ${browserConnection.port}...`);
    console.log('WebSocket endpoint:', browserConnection.wsEndpoint);
    
    // Create and execute the script function as async
    const scriptFn = new Function('browserConnection', 'puppeteer', 
      `return (async function() { ${script} })();`
    );
    
    const result = await scriptFn(browserConnection, puppeteer);
    
    console.log('Workflow execution completed:', result);
    
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
