
import express from 'express';
import cors from 'cors';
import corsConfig from './config/cors.js';
import { getBrowsersList } from './controllers/browserController.js';
import { startRecording, stopRecording } from './controllers/recordingController.js';
import { executeWorkflow } from './controllers/workflowController.js';
import { initializeToken, registerServer } from './controllers/registrationController.js';
import tcpPortUsed from 'tcp-port-used';
import log from 'electron-log';

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

const SERVER_TOKEN = initializeToken();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/generate-with-ai', async (req, res) => {
  const { prompt, availableNodes, nebiusKey } = req.body;
  
  try {
    const response = await fetch('https://api.studio.nebius.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nebiusKey}`
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that generates workflow automation scripts based on user prompts.
            Available node types: ${JSON.stringify(availableNodes)}.
            Generate a JSON response with nodes and edges that can be used with React Flow.
            Response format:
            {
              "nodes": [
                {
                  "id": string,
                  "type": string (must be one of available node types),
                  "data": { "label": string, "settings": object },
                  "position": { "x": number, "y": number }
                }
              ],
              "edges": [
                {
                  "id": string,
                  "source": string (node id),
                  "target": string (node id)
                }
              ]
            }`
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 512,
        temperature: 0.6,
        top_p: 0.9,
        extra_body: {
          top_k: 50
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate flow');
    }

    const data = await response.json();
    const generatedFlow = JSON.parse(data.choices[0].message.content);
    res.json(generatedFlow);
  } catch (error) {
    console.error('Error in AI generation:', error);
    res.status(500).json({ error: error.message });
  }
});

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

app.post('/linken-sphere/sessions/start', async (req, res) => {
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

app.post('/linken-sphere/sessions/stop', async (req, res) => {
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
      log.error(`Error checking port ${port}:`, err);
    }
  }
  throw new Error(`No available ports found between ${startPort} and ${startPort + maxTries - 1}`);
};

const startServer = async () => {
  try {
    const defaultPort = process.env.PORT || 3001;
    const port = await findAvailablePort(Number(defaultPort));
    
    app.listen(port, '0.0.0.0', () => {
      log.info(`Server running on port ${port}`);
      log.info(`Server URL: http://localhost:${port}`);
      log.info('Available endpoints:');
      log.info('- POST /register');
      log.info('- GET /browsers');
      log.info('- POST /execute-workflow');
      log.info('- POST /start-recording');
      log.info('- POST /stop-recording');
      log.info('- GET /health');
      log.info('- POST /generate-with-ai');
    });
  } catch (error) {
    log.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
