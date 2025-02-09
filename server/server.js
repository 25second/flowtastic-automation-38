const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');
const tcpPortUsed = require('tcp-port-used');

const app = express();

// Configure CORS to explicitly allow all origins during development
app.use(cors());
app.use(express.json());

// Store the server token when starting
const SERVER_TOKEN = uuidv4();
console.log('Server Token:', SERVER_TOKEN);
console.log('Server accepting connections from all origins during development');

let recordingPage = null;
let recordedActions = [];

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
  try {
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
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

app.post('/start-recording', async (req, res) => {
  const { browserPort } = req.body;
  
  try {
    console.log(`Connecting to browser on port ${browserPort}...`);
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${browserPort}`,
      defaultViewport: null
    });

    // Clear previous recording
    recordedActions = [];
    
    // Create a new page for recording
    recordingPage = await browser.newPage();
    
    // Setup page event listeners
    await recordingPage.exposeFunction('recordAction', (action) => {
      console.log('Recorded action:', action);
      recordedActions.push(action);
    });

    // Inject recording scripts
    await recordingPage.evaluateOnNewDocument(() => {
      // Record clicks
      document.addEventListener('click', async (e) => {
        const selector = e.target.id 
          ? `#${e.target.id}`
          : e.target.className 
            ? `.${e.target.className.split(' ')[0]}`
            : e.target.tagName.toLowerCase();
        await window.recordAction({
          type: 'page-click',
          data: {
            label: 'Click Element',
            settings: { selector },
            description: `Click on ${selector}`
          }
        });
      });

      // Record form inputs
      document.addEventListener('input', async (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          const selector = e.target.id 
            ? `#${e.target.id}`
            : e.target.className 
              ? `.${e.target.className.split(' ')[0]}`
              : e.target.tagName.toLowerCase();
          await window.recordAction({
            type: 'page-type',
            data: {
              label: 'Type Text',
              settings: { 
                selector,
                text: e.target.value
              },
              description: `Type "${e.target.value}" into ${selector}`
            }
          });
        }
      });

      // Record navigation
      const originalPushState = history.pushState;
      history.pushState = function() {
        window.recordAction({
          type: 'goto',
          data: {
            label: 'Navigate',
            settings: { url: arguments[2] },
            description: `Navigate to ${arguments[2]}`
          }
        });
        return originalPushState.apply(this, arguments);
      };

      // Record URL changes
      window.addEventListener('popstate', () => {
        window.recordAction({
          type: 'goto',
          data: {
            label: 'Navigate',
            settings: { url: window.location.href },
            description: `Navigate to ${window.location.href}`
          }
        });
      });

      // Record initial page load
      window.recordAction({
        type: 'goto',
        data: {
          label: 'Navigate',
          settings: { url: window.location.href },
          description: `Navigate to ${window.location.href}`
        }
      });
    });

    console.log('Recording started');
    res.json({ message: 'Recording started' });
  } catch (error) {
    console.error('Error starting recording:', error);
    res.status(500).json({ error: 'Failed to start recording' });
  }
});

app.post('/stop-recording', async (req, res) => {
  try {
    if (recordingPage) {
      await recordingPage.close();
      recordingPage = null;
    }

    console.log('Recording stopped. Actions:', recordedActions);
    
    // Convert recorded actions to nodes
    const nodes = recordedActions.map((action, index) => ({
      id: `recorded-${index}`,
      type: action.type,
      position: { x: 100, y: 100 + (index * 100) },
      data: action.data,
      style: {
        background: '#fff',
        padding: '15px',
        borderRadius: '8px',
        width: 180,
      },
    }));

    res.json({ nodes });
  } catch (error) {
    console.error('Error stopping recording:', error);
    res.status(500).json({ error: 'Failed to stop recording' });
  }
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
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /register');
  console.log('- GET /browsers');
  console.log('- POST /execute-workflow');
  console.log('- POST /start-recording');
  console.log('- POST /stop-recording');
});
