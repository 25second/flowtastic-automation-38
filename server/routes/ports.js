
const express = require('express');
const router = express.Router();
const tcpPortUsed = require('tcp-port-used');
const fetch = require('node-fetch');

// Check if a port is available/in use
router.get('/check', async (req, res) => {
  const port = parseInt(req.query.port);
  
  if (!port || isNaN(port)) {
    return res.status(400).json({ 
      available: false, 
      error: 'Invalid port number' 
    });
  }
  
  try {
    console.log(`Checking if port ${port} is in use...`);
    const isInUse = await tcpPortUsed.check(port, '127.0.0.1');
    
    console.log(`Port ${port} is ${isInUse ? 'in use' : 'not in use'}`);
    
    // For browser debugging purposes, "available" means the port IS in use
    // (i.e., there's a browser debugger listening on it)
    res.json({ 
      available: isInUse,
      port
    });
  } catch (error) {
    console.error(`Error checking port ${port}:`, error);
    res.status(500).json({ 
      available: false, 
      error: error.message 
    });
  }
});

// Get version info from Chrome DevTools Protocol
router.get('/version', async (req, res) => {
  const port = req.query.port;
  
  if (!port) {
    return res.status(400).json({ error: 'Port parameter is required' });
  }
  
  try {
    console.log(`Getting version info from port ${port}...`);
    
    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`http://127.0.0.1:${port}/json/version`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to get version info: ${response.statusText}`
      });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error getting version info from port ${port}:`, error);
    
    const errorMessage = error.name === 'AbortError' 
      ? 'Connection timed out' 
      : error.message;
    
    res.status(500).json({ error: errorMessage });
  }
});

// Get list of pages from Chrome DevTools Protocol
router.get('/list', async (req, res) => {
  const port = req.query.port;
  
  if (!port) {
    return res.status(400).json({ error: 'Port parameter is required' });
  }
  
  try {
    console.log(`Getting page list from port ${port}...`);
    
    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`http://127.0.0.1:${port}/json/list`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to get page list: ${response.statusText}`
      });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error getting page list from port ${port}:`, error);
    
    const errorMessage = error.name === 'AbortError' 
      ? 'Connection timed out' 
      : error.message;
    
    res.status(500).json({ error: errorMessage });
  }
});

module.exports = router;
