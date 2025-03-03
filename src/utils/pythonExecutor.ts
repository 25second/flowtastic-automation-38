
import { isElectronApp } from '@/electron';
import { toast } from 'sonner';

/**
 * Utility for executing Python scripts in Electron environment
 */
export class PythonExecutor {
  private static pythonPath: string | null = null;
  private static isInitialized: boolean = false;

  /**
   * Initialize Python environment
   */
  static async initialize(): Promise<boolean> {
    if (!isElectronApp) {
      console.warn('Python execution is only available in Electron environment');
      return false;
    }

    if (this.isInitialized) return true;

    try {
      // In Electron, we can access the node modules
      const electron = window.require('electron');
      const { app } = electron.remote;
      const path = window.require('path');
      const fs = window.require('fs');
      const appPath = app.getAppPath();
      
      // Check for bundled Python in resources folder
      // Handle both development and production paths
      const resourcesPath = process.env.NODE_ENV === 'development' 
        ? path.join(appPath, 'resources') 
        : path.join(app.getPath('exe'), '..', 'resources');
      
      const pythonFolderPath = path.join(resourcesPath, 'python');
      
      // On Windows, the Python executable is python.exe
      // On Mac/Linux it's just 'python' or 'python3'
      const isWindows = process.platform === 'win32';
      const pythonExecutable = isWindows ? 'python.exe' : 'python3';
      const pythonPath = path.join(pythonFolderPath, pythonExecutable);
      
      if (fs.existsSync(pythonPath)) {
        this.pythonPath = pythonPath;
        this.isInitialized = true;
        console.log('Python environment initialized successfully:', pythonPath);
        return true;
      } else {
        // If bundled Python is not found, try to use system Python
        this.pythonPath = isWindows ? 'python' : 'python3';
        console.warn('Bundled Python not found, using system Python:', this.pythonPath);
        this.isInitialized = true;
        return true;
      }
    } catch (error) {
      console.error('Failed to initialize Python environment:', error);
      toast.error('Failed to initialize Python environment');
      return false;
    }
  }

  /**
   * Execute a Python script with given arguments
   * @param script Path to the Python script
   * @param args Arguments to pass to the script
   * @returns Promise with the script output
   */
  static async executeScript(script: string, args: string[] = []): Promise<string> {
    if (!isElectronApp) {
      throw new Error('Python execution is only available in Electron environment');
    }

    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('Python environment could not be initialized');
      }
    }

    return new Promise((resolve, reject) => {
      try {
        const { PythonShell } = window.require('python-shell');
        const options = {
          mode: 'text',
          pythonPath: this.pythonPath || undefined,
          pythonOptions: ['-u'], // unbuffered output
          args: args
        };

        PythonShell.run(script, options)
          .then((results: string[]) => {
            resolve(results.join('\n'));
          })
          .catch((err: Error) => {
            console.error('Error executing Python script:', err);
            reject(err);
          });
      } catch (error) {
        console.error('Error setting up Python execution:', error);
        reject(error);
      }
    });
  }

  /**
   * Execute Python code directly
   * @param code Python code to execute
   * @returns Promise with the execution result
   */
  static async executeCode(code: string): Promise<string> {
    if (!isElectronApp) {
      throw new Error('Python execution is only available in Electron environment');
    }

    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('Python environment could not be initialized');
      }
    }

    return new Promise((resolve, reject) => {
      try {
        const { PythonShell } = window.require('python-shell');
        const options = {
          mode: 'text',
          pythonPath: this.pythonPath || undefined,
          pythonOptions: ['-c', code]
        };

        PythonShell.run('', options)
          .then((results: string[]) => {
            resolve(results.join('\n'));
          })
          .catch((err: Error) => {
            console.error('Error executing Python code:', err);
            reject(err);
          });
      } catch (error) {
        console.error('Error setting up Python execution:', error);
        reject(error);
      }
    });
  }
}
