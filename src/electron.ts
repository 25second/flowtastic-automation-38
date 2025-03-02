
// Electron integration utilities
let isElectron = false;

try {
  // Check if running in Electron
  isElectron = window && window.process && window.process.type === 'renderer';
} catch (e) {
  isElectron = false;
}

export const isElectronApp = isElectron;

// Typed interface for Electron APIs exposed through preload
interface ElectronAPI {
  send: (channel: string, data: any) => void;
  receive: (channel: string, func: (...args: any[]) => void) => void;
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
