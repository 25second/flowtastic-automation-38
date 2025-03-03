
// Electron integration utilities
let isElectron = false;

try {
  // Check if running in Electron
  // We need to check for process and then check its type property safely
  isElectron = window && 
    typeof window.process === 'object' && 
    typeof (window.process as any).type === 'string' && 
    (window.process as any).type === 'renderer';
} catch (e) {
  isElectron = false;
}

export const isElectronApp = isElectron;

// Typed interface for Electron APIs exposed through preload
interface ElectronAPI {
  send: (channel: string, data: any) => void;
  receive: (channel: string, func: (...args: any[]) => void) => void;
  // Python-related methods
  executePython?: (scriptPath: string, args: string[]) => Promise<string>;
  executePythonCode?: (code: string) => Promise<string>;
  // Browser-use specific methods
  checkBrowserUseInstalled?: () => Promise<boolean>;
}

// Access to Electron APIs (will be undefined in browser)
export const electronAPI: ElectronAPI | undefined = (window as any).electron;

// Helper to save files using Electron's dialog
export function saveFile(content: string, filename: string, extension: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isElectronApp || !electronAPI) {
      // Fallback to browser download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve(true);
    } else {
      // We'll implement this using IPC when needed
      resolve(false);
    }
  });
}

// Execute Python script via Electron preload bridge
export async function executePythonScript(scriptPath: string, args: string[] = []): Promise<string> {
  if (!isElectronApp || !electronAPI || !electronAPI.executePython) {
    throw new Error('Python execution is only available in Electron application');
  }
  
  return electronAPI.executePython(scriptPath, args);
}

// Execute Python code via Electron preload bridge
export async function executePythonCode(code: string): Promise<string> {
  if (!isElectronApp || !electronAPI || !electronAPI.executePythonCode) {
    throw new Error('Python execution is only available in Electron application');
  }
  
  return electronAPI.executePythonCode(code);
}

// Check if browser-use is installed
export async function checkBrowserUseInstalled(): Promise<boolean> {
  if (!isElectronApp || !electronAPI || !electronAPI.checkBrowserUseInstalled) {
    return false;
  }
  
  return electronAPI.checkBrowserUseInstalled();
}

// Use browser-use library via Python bridge
export async function useBrowserUse(url: string, port: number, debug: boolean = false): Promise<any> {
  const scriptPath = 'browser_use_example.py';
  const args = [
    '--url', url,
    '--port', port.toString()
  ];
  
  if (debug) {
    args.push('--debug');
  }
  
  const result = await executePythonScript(scriptPath, args);
  
  try {
    return JSON.parse(result);
  } catch (e) {
    console.error('Failed to parse browser-use result:', e);
    return { 
      status: 'error', 
      error: 'Failed to parse result',
      raw: result
    };
  }
}
