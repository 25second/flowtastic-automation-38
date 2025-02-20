
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkPortAvailable = async (port: number): Promise<boolean> => {
  console.group(`Checking port ${port} availability`);
  try {
    // Изменяем путь с /check-port на /ports/check
    const response = await fetch(`http://localhost:3001/ports/check?port=${port}`);
    const result = await response.json();

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
