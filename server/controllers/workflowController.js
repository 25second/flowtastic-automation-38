
import puppeteer from 'puppeteer';

export async function executeWorkflow(req, res) {
  console.log('Received workflow execution request');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  const { nodes, edges, browserPort } = req.body;
  
  try {
    console.log(`Connecting to browser on port ${browserPort}...`);
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${browserPort}`,
      defaultViewport: null
    });

    console.log('Creating new page...');
    const page = await browser.newPage();
    
    // Process nodes in sequence
    for (const node of nodes) {
      console.log('Processing node:', node);
      
      // Extract settings from the node data
      const settings = node.data?.settings || {};
      
      switch (node.type) {
        case 'tab-new':
          console.log(`Opening new tab with URL: ${settings.url}`);
          const newPage = await browser.newPage();
          if (settings.url) {
            console.log(`Navigating to ${settings.url}...`);
            await newPage.goto(settings.url, { 
              waitUntil: 'networkidle0',
              timeout: 30000
            });
          }
          break;
          
        case 'goto':
          console.log(`Navigating to ${settings.url}...`);
          await page.goto(settings.url, { 
            waitUntil: 'networkidle0',
            timeout: 30000
          });
          break;
          
        case 'page-type':
          console.log(`Typing "${settings.text}" into "${settings.selector}"...`);
          await page.waitForSelector(settings.selector);
          await page.type(settings.selector, settings.text);
          break;
          
        case 'page-click':
          console.log(`Clicking element "${settings.selector}"...`);
          await page.waitForSelector(settings.selector);
          await page.click(settings.selector);
          break;
      }
    }

    console.log('Workflow executed successfully');
    res.json({ message: 'Workflow executed successfully' });
  } catch (error) {
    console.error('Workflow execution error:', error);
    res.status(500).json({ error: 'Workflow execution failed: ' + error.message });
  }
}
