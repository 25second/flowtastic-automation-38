
/**
 * Helper functions for detecting Electron environment
 */

// Check if the app is running in Electron
export const isElectronApp = window && 
  window.process && 
  window.process.type && 
  window.navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;

// Get Electron API if available
export const electron = isElectronApp ? window.require('electron') : null;

// Safe access to IPC renderer
export const ipcRenderer = electron ? electron.ipcRenderer : null;

