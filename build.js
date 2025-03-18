
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure build directory exists
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Create placeholder icons if they don't exist
const iconFiles = {
  'icon.ico': path.join(buildDir, 'icon.ico'),
  'icon.icns': path.join(buildDir, 'icon.icns'),
  'icon.png': path.join(buildDir, 'icon.png')
};

for (const [fileName, filePath] of Object.entries(iconFiles)) {
  if (!fs.existsSync(filePath)) {
    console.log(`Creating placeholder ${fileName}...`);
    // Create an empty file as placeholder
    fs.writeFileSync(filePath, '');
  }
}

// Function to execute commands and log output
function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    // Set NODE_OPTIONS environment variable to increase memory limit
    const env = { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' };
    execSync(command, { stdio: 'inherit', env });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Check if dependencies are installed
console.log('Installing dependencies...');
runCommand('npm install');

// Build React application
console.log('Building React application...');
runCommand('npm run build');

// Copy files to electron directory if needed
console.log('Setting up Electron build...');

// Build Electron application
console.log('Building Electron application...');
const platform = process.platform;

switch (platform) {
  case 'win32':
    runCommand('cd electron && npm install && npm run build:win');
    break;
  case 'darwin':
    runCommand('cd electron && npm install && npm run build:mac');
    break;
  case 'linux':
    runCommand('cd electron && npm install && npm run build:linux');
    break;
  default:
    runCommand('cd electron && npm install && npm run build');
}

console.log('Build complete. Output is in the release directory.');
