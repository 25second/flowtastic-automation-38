
import express from 'express';
import cors from 'cors';
import corsConfig from './config/cors.js';
import { getBrowsersList } from './controllers/browserController.js';
import { startRecording, stopRecording } from './controllers/recordingController.js';
import { executeWorkflow } from './controllers/workflowController.js';
import { initializeToken, registerServer } from './controllers/registrationController.js';

const app = express();

// Configure CORS and middleware
app.use(cors(corsConfig));
app.use(express.json());

// Initialize server token
const SERVER_TOKEN = initializeToken();

// Routes
app.get('/browsers', getBrowsersList);
app.post('/register', registerServer);
app.post('/start-recording', startRecording);
app.post('/stop-recording', stopRecording);
app.post('/execute-workflow', executeWorkflow);

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
