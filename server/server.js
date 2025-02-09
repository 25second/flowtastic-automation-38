
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');
const tcpPortUsed = require('tcp-port-used');

const app = express();
app.use(cors());
app.use(express.json());

// Store the server token when starting
const SERVER_TOKEN = uuidv4();
console.log('Server Token:', SERVER_TOKEN);

// Function to get running Chrome instances
async function getChromeBrowsers() {
  let browsers = [];
  console.log('Checking for Chrome instances...');
  
  // Check common debugging ports
  for (let port = 9222; port <= 9230; port++) {
    try {
      console.log(`Checking port ${port}...`);
      const inUse = await tcpPortUsed.check(port);
      console.log(`Port ${port} in use: ${inUse}`);
      
      if (inUse) {
        // Try to connect to verify it's actually Chrome
        try {
          const browser = await puppeteer.connect({
            browserURL: `http://localhost:${port}`,
            defaultViewport: null
          });
          
          // If we can connect, it's a valid Chrome instance
          await browser.disconnect();
          
          browsers.push({
            port,
            name: `Chrome (port ${port})`,
            type: 'chrome'
          });
          console.log(`Found Chrome browser on port ${port}`);
        } catch (err) {
          console.log(`Port ${port} is in use but not by Chrome: ${err.message}`);
        }
      }
    } catch (error) {
      console.error(`Error checking port ${port}:`, error);
    }
  }

  console.log('Found browsers:', browsers);
  return browsers;
}

app.get('/browsers', async (req, res) => {
  try {
    console.log('Received request for browsers list');
    const browsers = await getChromeBrowsers();
    console.log('Sending browsers list:', browsers);
    res.json({ browsers });
  } catch (error) {
    console.error('Error getting browsers:', error);
    res.status(500).json({ error: 'Failed to get browser list' });
  }
});

app.post('/register', async (req, res) => {
  const { token } = req.body;
  console.log('Received registration request');
  
  if (token !== SERVER_TOKEN) {
    console.log('Invalid token received:', token);
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
  const { nodes, edges, browserPort } = req.body;
  
  try {
    console.log(`Connecting to browser on port ${browserPort}...`);
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${browserPort}`,
      defaultViewport: null
    });

    const page = await browser.newPage();

    for (const node of nodes) {
      if (node.type === 'typeText') {
        const { selector, text } = node.data.settings;
        await page.type(selector, text);
      } else if (node.type === 'click') {
        const { selector } = node.data.settings;
        await page.click(selector);
      } else if (node.type === 'goto') {
        const { url } = node.data.settings;
        await page.goto(url);
      }
    }

    res.json({ message: 'Workflow executed successfully' });
  } catch (error) {
    console.error('Workflow execution error:', error);
    res.status(500).json({ error: 'Workflow execution failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

