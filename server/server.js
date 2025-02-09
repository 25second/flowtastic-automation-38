
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');
const tcpPortUsed = require('tcp-port-used');
const { execSync } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Store the server token when starting
const SERVER_TOKEN = uuidv4();
console.log('Server Token:', SERVER_TOKEN);

// Function to get running Chrome instances
async function getChromeBrowsers() {
  let browsers = [];
  
  // Check common debugging ports
  for (let port = 9222; port <= 9230; port++) {
    try {
      const inUse = await tcpPortUsed.check(port);
      if (inUse) {
        browsers.push({
          port,
          name: `Chrome (port ${port})`,
          type: 'chrome'
        });
      }
    } catch (error) {
      console.error(`Error checking port ${port}:`, error);
    }
  }

  return browsers;
}

app.get('/browsers', async (req, res) => {
  try {
    const browsers = await getChromeBrowsers();
    res.json({ browsers });
  } catch (error) {
    console.error('Error getting browsers:', error);
    res.status(500).json({ error: 'Failed to get browser list' });
  }
});

app.post('/register', async (req, res) => {
  const { token } = req.body;
  
  // Verify the token matches this server's token
  if (token !== SERVER_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Generate a unique ID for this server instance
  const serverId = uuidv4();
  
  res.json({ 
    serverId,
    message: 'Server registered successfully' 
  });
});

app.post('/execute-workflow', async (req, res) => {
  const { nodes, edges, browserPort } = req.body;
  
  try {
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${browserPort || 9222}`,
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
