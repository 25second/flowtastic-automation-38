
const { v4: uuidv4 } = require('uuid');

let SERVER_TOKEN = null;

function initializeToken() {
  SERVER_TOKEN = uuidv4();
  console.log('Server Token:', SERVER_TOKEN);
  console.log('Server accepting connections from all origins during development');
  return SERVER_TOKEN;
}

async function registerServer(req, res) {
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
}

module.exports = {
  initializeToken,
  registerServer
};
