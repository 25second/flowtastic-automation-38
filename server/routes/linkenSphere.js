
import express from 'express';
import fetch from 'node-fetch';
import tcpPortUsed from 'tcp-port-used';

const router = express.Router();

router.get('/sessions', async (req, res) => {
  const { port } = req.query;
  
  if (!port) {
    return res.status(400).json({ error: 'API port is required' });
  }
  
  try {
    let isPortInUse = false;
    try {
      console.log(`Checking if port ${port} is in use...`);
      isPortInUse = await tcpPortUsed.check(Number(port), '127.0.0.1');
      console.log(`Port ${port} in use:`, isPortInUse);
    } catch (portError) {
      console.error(`Error checking port ${port}:`, portError);
      return res.status(500).json({
        error: 'Failed to check port status',
        details: portError.message,
        port: port
      });
    }
    
    if (!isPortInUse) {
      console.error(`Port ${port} is not in use`);
      return res.status(500).json({
        error: 'Failed to fetch Linken Sphere sessions',
        details: `Port ${port} is not in use. Make sure LinkenSphere is running and the port is correct.`,
        port: port,
        portStatus: 'closed'
      });
    }

    console.log('Attempting to fetch Linken Sphere sessions from port:', port);
    
    const controller = new AbortController();
    const timeoutDuration = 5000;
    const timeout = setTimeout(() => {
      controller.abort();
    }, timeoutDuration);

    try {
      const response = await fetch(`http://127.0.0.1:${port}/sessions`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeout);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch sessions. Status:', response.status, 'Response:', errorText);
        throw new Error(`Failed to fetch sessions: ${response.statusText || errorText}`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched sessions:', data);
      res.json(data);
    } catch (fetchError) {
      clearTimeout(timeout);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching Linken Sphere sessions:', error);
    
    res.status(500).json({ 
      error: 'Failed to fetch Linken Sphere sessions',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      port: port,
      type: error.name,
      timeout: error.name === 'AbortError',
      timestamp: new Date().toISOString()
    });
  }
});

router.post('/sessions/start', async (req, res) => {
  const { debug_port, uuid, headless } = req.body;
  const { port } = req.query;
  
  if (!port) {
    return res.status(400).json({ error: 'API port is required' });
  }
  
  try {
    console.log('Server received start session request:', {
      uuid,
      headless,
      debug_port
    });

    const response = await fetch(`http://127.0.0.1:${port}/sessions/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid,
        headless,
        debug_port
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to start session');
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error starting Linken Sphere session:', error);
    res.status(500).json({ error: error.message || 'Failed to start session' });
  }
});

router.post('/sessions/stop', async (req, res) => {
  const { uuid } = req.body;
  const { port } = req.query;
  
  if (!port) {
    return res.status(400).json({ error: 'API port is required' });
  }
  
  try {
    const response = await fetch(`http://127.0.0.1:${port}/sessions/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uuid }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to stop session');
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error stopping Linken Sphere session:', error);
    res.status(500).json({ error: error.message || 'Failed to stop session' });
  }
});

export default router;
