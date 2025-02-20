
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkPortAvailable = async (port: number): Promise<boolean> => {
  console.group(`Checking port ${port} availability`);
  try {
    // Try basic TCP connection first
    const response = await fetch(`http://127.0.0.1:${port}`);
    if (response.ok || response.status === 404) {
      console.log('✓ Port is responding to HTTP requests');
      console.groupEnd();
      return true;
    }

    // If basic connection failed, try debug endpoints
    const endpoints = [
      '/json/version',
      '/json/list',
      '/json',
      '/favicon.ico', // Sometimes browsers respond only to this
      '/' // Try root path
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await fetch(`http://127.0.0.1:${port}${endpoint}`);
        if (response.ok || response.status === 404) {
          console.log(`✓ Port is available (responded to ${endpoint})`);
          console.groupEnd();
          return true;
        }
      } catch (error) {
        console.log(`⚠️ Endpoint ${endpoint} not available:`, error);
      }
    }

    console.log('❌ No endpoints responded successfully');
    console.groupEnd();
    return false;
  } catch (error) {
    console.log('❌ Error checking port:', error);
    console.groupEnd();
    return false;
  }
};

export const waitForPort = async (port: number, maxAttempts = 10, delayMs = 2000): Promise<boolean> => {
  console.group(`Waiting for port ${port}`);
  console.log(`Will try ${maxAttempts} times with ${delayMs}ms delay between attempts`);

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

export { delay };
