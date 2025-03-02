const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window with appropriate settings
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, '../build/icon.png'),
    show: false // Don't show until ready-to-show
  });

  // Load the app - in production from the dist files, in dev from the dev server
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  mainWindow.loadURL(startUrl);

  // Show window when ready and maximize
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create the window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, recreate window when the dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Example IPC handler for saving files
ipcMain.handle('save-file', async (event, { content, filename, extension }) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: `${filename}.${extension}`,
      filters: [
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (!canceled && filePath) {
      fs.writeFileSync(filePath, content);
      return { success: true, filePath };
    }
    return { success: false, reason: 'User canceled' };
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, reason: error.message };
  }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
