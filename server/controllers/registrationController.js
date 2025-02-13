
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
      console.log('Server is using existing token from token.txt');
      console.log('To connect a server, use this token:', SERVER_TOKEN);
    } else {
      // Generate new token and save it
      SERVER_TOKEN = uuidv4();
      fs.writeFileSync(TOKEN_FILE_PATH, SERVER_TOKEN);
      console.log('Generated new server token and saved to token.txt');
      console.log('To connect a server, use this token:', SERVER_TOKEN);
    }
  } catch (error) {
    console.error('Error handling token file:', error);
    // Fallback to generating new token without saving if file operations fail
    SERVER_TOKEN = uuidv4();
    console.log('Failed to save token to file, using temporary token:', SERVER_TOKEN);
  }

  return SERVER_TOKEN;
}

export async function registerServer(req, res) {
  try {
    console.log('Received registration request');
    const { token } = req.body;
    
    if (!token) {
      console.log('No token provided in request');
      return res.status(400).json({ 
        error: 'No token provided',
        message: 'Please provide a server token'
      });
    }
    
    console.log('Comparing received token:', token);
    console.log('With server token:', SERVER_TOKEN);
    
    if (token !== SERVER_TOKEN) {
      console.log('Token validation failed');
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token does not match the server token. Please check the server console for the correct token.'
      });
    }

    const serverId = uuidv4();
    console.log('Server registered successfully with ID:', serverId);
    
    res.json({ 
      serverId,
      message: 'Server registered successfully' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message 
    });
  }
}
