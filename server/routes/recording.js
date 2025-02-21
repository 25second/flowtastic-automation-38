
import express from 'express';
import { recordingController } from '../controllers/recordingController.js';

const router = express.Router();

router.post('/start', async (req, res) => {
  try {
    const { browserPort } = req.body;
    const result = await recordingController.startRecording(browserPort);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stop', async (req, res) => {
  try {
    const { browserPort } = req.body;
    const result = await recordingController.stopRecording(browserPort);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
