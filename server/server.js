
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');
const tcpPortUsed = require('tcp-port-used');

const app = express();

// Configure CORS to explicitly allow the preview domain
app.use(cors({
  origin: ['https://preview--flowtastic-automation.lovable.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

// Store the server token when starting
const SERVER_TOKEN = uuidv4();
console.log('Server Token:', SERVER_TOKEN);
console.log('Server accepting connections from preview domain and localhost');

// Function to get running Chrome instances
async function getChromeBrowsers() {
  let browsers = [];
  console.log('Checking for Chrome instances...');
  
  // Check common debugging ports
  for (let port = 9222; port <= 9230; port++) {
    try {
      console.log(`\nChecking Chrome debugging endpoint on port ${port}...`);
      
      // Try to connect directly to Chrome's debugging endpoint
      const response = await fetch(`http://localhost:${port}/json/version`, {
        // Set a short timeout to avoid hanging
        signal: AbortSignal.timeout(1000)
      }).catch(err => {
        console.log(`Connection attempt failed on port ${port}:`, err.message);
        return null;
      });

      if (response && response.ok) {
        const versionInfo = await response.json();
        console.log(`Found Chrome instance on port ${port}:`, versionInfo);
        
        browsers.push({
          port,
          name: `Chrome ${versionInfo.Browser || 'Unknown'} (port ${port})`,
          type: 'chrome'
        });
      } else {
        console.log(`No Chrome instance found on port ${port}`);
      }
    } catch (error) {
      console.log(`Error checking Chrome on port ${port}:`, error.message);
      console.log('Make sure Chrome was started with:');
      console.log(`chrome.exe --remote-debugging-port=${port}`);
    }
  }

  console.log('\nFound browsers:', browsers);
  return browsers;
}

app.get('/browsers', async (req, res) => {
  try {
    console.log('Received request for browsers list');
    console.log('Request headers:', req.headers);
    const browsers = await getChromeBrowsers();
    console.log('Sending browsers list:', browsers);
    res.json({ browsers });
  } catch (error) {
    console.error('Error getting browsers:', error);
    res.status(500).json({ error: 'Failed to get browser list' });
  }
});

app.post('/register', async (req, res) => {
  console.log('Received registration request');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  const { token } = req.body;
  
  if (!token) {
    console.log('No token provided in request');
    return res.status(400).json({ error: 'No token provided' });
  }
  
  if (token !== SERVER_TOKEN) {
    console.log('Invalid token received:', token);
    console.log('Expected token:', SERVER_TOKEN);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const serverId = uuidv4();
  console.log('Server registered with ID:', serverId);
  
  res.json({ 
    serverId,
    message: 'Server registered successfully' 
  });
});

app.post('/execute-workflow', async (req, res) => {
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
      
      if (node.type === 'goto') {
        const { url } = node.data.settings;
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle0' });
      } else if (node.type === 'typeText') {
        const { selector, text } = node.data.settings;
        console.log(`Typing "${text}" into "${selector}"...`);
        await page.waitForSelector(selector);
        await page.type(selector, text);
      } else if (node.type === 'click') {
        const { selector } = node.data.settings;
        console.log(`Clicking element "${selector}"...`);
        await page.waitForSelector(selector);
        await page.click(selector);
      }
    }

    console.log('Workflow executed successfully');
    res.json({ message: 'Workflow executed successfully' });
  } catch (error) {
    console.error('Workflow execution error:', error);
    res.status(500).json({ error: 'Workflow execution failed: ' + error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /register');
  console.log('- GET /browsers');
  console.log('- POST /execute-workflow');
});
