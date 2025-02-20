
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkPortAvailable = async (port: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const waitForPort = async (port: number, maxAttempts = 5): Promise<boolean> => {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Checking port ${port} availability (attempt ${i + 1}/${maxAttempts})...`);
    if (await checkPortAvailable(port)) {
      console.log(`Port ${port} is now available`);
      return true;
    }
    await delay(2000);
  }
  return false;
};

export { delay };
