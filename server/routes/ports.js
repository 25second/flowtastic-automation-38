
import express from 'express';
import tcpPortUsed from 'tcp-port-used';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/check', async (req, res) => {
  const { port } = req.query;
  
  if (!port || isNaN(Number(port))) {
    return res.status(400).json({ 
      error: 'Invalid port parameter',
      available: false 
    });
  }

  try {
    console.log(`Server checking port ${port}...`);
    
    const isPortInUse = await tcpPortUsed.check(Number(port), '127.0.0.1');
    
    if (!isPortInUse) {
      console.log(`Port ${port} is not in use`);
      return res.json({ available: false });
    }

    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await response.json();
      console.log(`Port ${port} responded with version info:`, data);
      return res.json({ available: true, version: data });
    } catch (error) {
      console.log(`Could not get version info from port ${port}:`, error);
      return res.json({ available: true });
    }
  } catch (error) {
    console.error(`Error checking port ${port}:`, error);
    return res.json({ 
      available: false,
      error: error.message 
    });
  }
});

export default router;
