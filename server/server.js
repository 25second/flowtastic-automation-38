
import express from 'express';
import cors from 'cors';
import corsConfig from './config/cors.js';
import { getBrowsersList } from './controllers/browserController.js';
import { startRecording, stopRecording } from './controllers/recordingController.js';
import { executeWorkflow } from './controllers/workflowController.js';
import { initializeToken, registerServer } from './controllers/registrationController.js';
import tcpPortUsed from 'tcp-port-used';

const app = express();

// Configure CORS and middleware
app.use(cors(corsConfig));
app.use(express.json());

// Initialize server token
const SERVER_TOKEN = initializeToken();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Linken Sphere sessions endpoint
app.get('/linken-sphere/sessions', async (req, res) => {
  const { port } = req.query;
  
  try {
    const response = await fetch(`http://127.0.0.1:${port}/sessions`);
    if (!response.ok) throw new Error('Failed to fetch sessions');
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Linken Sphere sessions:', error);
    res.status(500).json({ error: 'Failed to fetch Linken Sphere sessions' });
  }
});

// Routes
app.get('/browsers', getBrowsersList);
app.post('/register', registerServer);
app.post('/start-recording', startRecording);
app.post('/stop-recording', stopRecording);
app.post('/execute-workflow', executeWorkflow);

const findAvailablePort = async (startPort, maxTries = 10) => {
  for (let port = startPort; port < startPort + maxTries; port++) {
    try {
      const inUse = await tcpPortUsed.check(port, '0.0.0.0');
      if (!inUse) {
        return port;
      }
    } catch (err) {
      console.error(`Error checking port ${port}:`, err);
    }
  }
  throw new Error(`No available ports found between ${startPort} and ${startPort + maxTries - 1}`);
};

const startServer = async () => {
  try {
    const defaultPort = process.env.PORT || 3001;
    const port = await findAvailablePort(Number(defaultPort));
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
      console.log(`Server URL: http://localhost:${port}`);
      console.log('Available endpoints:');
      console.log('- POST /register');
      console.log('- GET /browsers');
      console.log('- POST /execute-workflow');
      console.log('- POST /start-recording');
      console.log('- POST /stop-recording');
      console.log('- GET /health');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
