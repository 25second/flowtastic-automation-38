
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create python directory if it doesn't exist
const pythonDir = path.join(__dirname, '../python');
if (!fs.existsSync(pythonDir)) {
  fs.mkdirSync(pythonDir, { recursive: true });
}

// Create requirements.txt if it doesn't exist
const requirementsFile = path.join(pythonDir, 'requirements.txt');
if (!fs.existsSync(requirementsFile)) {
  fs.writeFileSync(requirementsFile, `
# Python dependencies for Flowtastic
requests>=2.25.1
beautifulsoup4>=4.9.3
lxml>=4.6.3
  `.trim());
  console.log('Created requirements.txt for Python dependencies');
}

// Check if we should try to install Python packages
const shouldInstallPackages = process.env.INSTALL_PYTHON_PACKAGES === 'true';

if (shouldInstallPackages) {
  try {
    console.log('Attempting to install Python packages...');
    // Try to install packages using pip
    const command = process.platform === 'win32' 
      ? 'pip install -r python/requirements.txt'
      : 'pip3 install -r python/requirements.txt';
    
    execSync(command, { stdio: 'inherit' });
    console.log('Python packages installed successfully');
  } catch (error) {
    console.warn('Failed to install Python packages. Manual installation may be required.');
    console.error(error.message);
  }
}

console.log('Electron post-install script completed');
