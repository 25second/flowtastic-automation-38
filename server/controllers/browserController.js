
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EXTENSION_PATH = path.join(__dirname, '..', 'chrome-extension');
const USER_DATA_DIR = path.join(__dirname, '..', 'chrome-user-data');

class BrowserController {
  constructor() {
    this.activeBrowsers = new Map();
  }

  async launchBrowser(port) {
    if (this.activeBrowsers.has(port)) {
      throw new Error(`Browser already running on port ${port}`);
    }

    const args = [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${USER_DATA_DIR}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--no-first-run',
      '--no-default-browser-check'
    ];

    const chrome = spawn('chromium', args);
    
    this.activeBrowsers.set(port, chrome);

    chrome.on('exit', () => {
      this.activeBrowsers.delete(port);
      console.log(`Browser on port ${port} closed`);
    });

    return { success: true, port };
  }

  async closeBrowser(port) {
    const browser = this.activeBrowsers.get(port);
    if (browser) {
      browser.kill();
      this.activeBrowsers.delete(port);
      return { success: true };
    }
    return { success: false, error: 'Browser not found' };
  }

  isActive(port) {
    return this.activeBrowsers.has(port);
  }
}

export const browserController = new BrowserController();
