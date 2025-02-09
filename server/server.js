
const express = require('express');
const cors = require('cors');
const corsConfig = require('./config/cors');
const { getBrowsersList } = require('./controllers/browserController');
const { startRecording, stopRecording } = require('./controllers/recordingController');
const { executeWorkflow } = require('./controllers/workflowController');
const { initializeToken, registerServer } = require('./controllers/registrationController');

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
