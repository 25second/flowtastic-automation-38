
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const tcpPortUsed = require('tcp-port-used');

// Get LinkenSphere sessions
router.get('/sessions', async (req, res) => {
  const port = req.query.port || '40080';
  console.log(`Fetching LinkenSphere sessions from port ${port}`);
  
  try {
    // First, check if the port is in use
    const isPortInUse = await tcpPortUsed.check(parseInt(port));
    
    if (!isPortInUse) {
      return res.status(400).json({
        success: false,
        portStatus: 'closed',
        details: `Port ${port} is not in use. Please check if LinkenSphere is running.`
      });
    }
    
    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`http://localhost:${port}/sessions`, {
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        details: `Failed to fetch sessions from LinkenSphere: ${response.statusText}`
      });
    }
    
    const data = await response.json();
    
    // Map the data to a standard format if needed
    res.json(data);
  } catch (error) {
    console.error('Error fetching LinkenSphere sessions:', error);
    
    // Handle abort error (timeout)
    if (error.name === 'AbortError') {
      return res.status(408).json({
        success: false,
        timeout: true,
        details: 'Connection timed out when trying to reach LinkenSphere'
      });
    }
    
    res.status(500).json({
      success: false,
      details: error.message || 'Error fetching LinkenSphere sessions'
    });
  }
});

// For future browser APIs, add more endpoints here

module.exports = router;
