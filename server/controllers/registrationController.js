
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let SERVER_TOKEN = null;
const TOKEN_FILE_PATH = path.join(__dirname, '..', 'token.txt');

export function initializeToken() {
  // Check if token file exists
  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      // Read existing token
      SERVER_TOKEN = fs.readFileSync(TOKEN_FILE_PATH, 'utf8').trim();
      console.log('Retrieved existing server token');
    } else {
      // Generate new token and save it
      SERVER_TOKEN = uuidv4();
      fs.writeFileSync(TOKEN_FILE_PATH, SERVER_TOKEN);
      console.log('Generated and saved new server token');
    }
  } catch (error) {
    console.error('Error handling token file:', error);
    // Fallback to generating new token without saving if file operations fail
    SERVER_TOKEN = uuidv4();
  }

  console.log('Server Token:', SERVER_TOKEN);
  console.log('Server accepting connections from all origins during development');
  return SERVER_TOKEN;
}

export async function registerServer(req, res) {
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
