
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkPortAvailable = async (port: number): Promise<boolean> => {
  console.group(`Checking port ${port} availability`);
  try {
    console.log(`Making request to check port ${port}...`);
    
    // Add timeout to fetch to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`http://localhost:3001/ports/check?port=${port}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.log(`❌ Port check request failed with status ${response.status}`);
      console.groupEnd();
      return false;
    }
    
    const result = await response.json();
    console.log(`Port check result:`, result);

    if (result.available) {
      console.log('✓ Port is available through server check');
      console.groupEnd();
      return true;
    }

    console.log('❌ Port not available through server check');
    console.groupEnd();
    return false;
  } catch (error) {
    console.log('❌ Error checking port:', error);
    console.groupEnd();
    return false;
  }
};

export const waitForPort = async (port: number, maxAttempts = 15, delayMs = 2000): Promise<boolean> => {
  console.group(`Waiting for port ${port}`);
  console.log(`Will try ${maxAttempts} times with ${delayMs}ms delay between attempts`);

  // First wait a bit to give the browser time to start up
  console.log('Initial delay before checking port...');
  await delay(1000);

  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Attempt ${i + 1}/${maxAttempts}`);
    
    if (await checkPortAvailable(port)) {
      console.log(`✓ Port ${port} is now available`);
      console.groupEnd();
      return true;
    }
    
    if (i < maxAttempts - 1) {
      console.log(`Waiting ${delayMs}ms before next attempt...`);
      await delay(delayMs);
    }
  }
  
  console.error(`❌ Port ${port} did not become available after ${maxAttempts} attempts`);
  console.groupEnd();
  return false;
};

// Direct TCP port check (more reliable than HTTP in some cases)
export const checkTcpPortDirectly = async (port: number): Promise<boolean> => {
  try {
    // Use WebSocket to check if port is open
    return new Promise((resolve) => {
      const ws = new WebSocket(`ws://localhost:${port}`);
      const timeout = setTimeout(() => {
        ws.close();
        resolve(false);
      }, 2000);
      
      ws.onopen = () => {
        clearTimeout(timeout);
        ws.close();
        resolve(true);
      };
      
      ws.onerror = () => {
        // For debugging browser CDP, an error might actually indicate the port is open
        // but not accepting WebSocket connections in this specific format
        clearTimeout(timeout);
        // We'll try with HTTP fetch to confirm
        resolve(checkPortAvailable(port));
      };
    });
  } catch (error) {
    console.error('Error in direct TCP port check:', error);
    return false;
  }
};

export { delay };
