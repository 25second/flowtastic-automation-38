
import { getChromeBrowsers } from '../utils/browserDetection.js';

export async function getBrowsersList(req, res) {
  try {
    console.log('Received request for browsers list');
    console.log('Request headers:', req.headers);
    const browsers = await getChromeBrowsers();
    console.log('Sending browsers list:', browsers);
    res.json({ browsers });
  } catch (error) {
    console.error('Error getting browsers:', error);
    res.status(500).json({ error: 'Failed to get browser list' });
  }
}
