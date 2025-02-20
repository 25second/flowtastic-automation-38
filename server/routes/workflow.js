
import express from 'express';
import { startRecording, stopRecording } from '../controllers/recordingController.js';
import { executeWorkflow } from '../controllers/workflowController.js';
import { registerServer } from '../controllers/registrationController.js';
import { getBrowsersList } from '../controllers/browserController.js';

const router = express.Router();

router.get('/browsers', getBrowsersList);
router.post('/register', registerServer);
router.post('/start-recording', startRecording);
router.post('/stop-recording', stopRecording);
router.post('/execute', executeWorkflow);

export default router;
