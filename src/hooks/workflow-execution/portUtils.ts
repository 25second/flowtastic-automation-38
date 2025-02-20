
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkPortAvailable = async (port: number): Promise<boolean> => {
  console.group('Checking Port Availability');
  try {
    // Try /json/version first
    console.log(`Trying /json/version on port ${port}...`);
    try {
      const versionResponse = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (versionResponse.ok) {
        console.log('✓ Port available (version endpoint)');
        console.groupEnd();
        return true;
      } else {
        console.log('⚠️ Version endpoint not available');
      }
    } catch (error) {
      console.log('⚠️ Version endpoint error:', error);
    }

    // Try /json/list as fallback
    console.log(`Trying /json/list on port ${port}...`);
    try {
      const listResponse = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (listResponse.ok) {
        console.log('✓ Port available (list endpoint)');
        console.groupEnd();
        return true;
      } else {
        console.log('⚠️ List endpoint not available');
      }
    } catch (error) {
      console.log('⚠️ List endpoint error:', error);
    }

    // Try /json as last resort
    console.log(`Trying /json on port ${port}...`);
    try {
      const jsonResponse = await fetch(`http://127.0.0.1:${port}/json`);
      if (jsonResponse.ok) {
        console.log('✓ Port available (json endpoint)');
        console.groupEnd();
        return true;
      } else {
        console.log('⚠️ Json endpoint not available');
      }
    } catch (error) {
      console.log('⚠️ Json endpoint error:', error);
    }

    console.log('❌ Port not available through any endpoint');
    console.groupEnd();
    return false;
  } catch (error) {
    console.error('❌ Error checking port availability:', error);
    console.groupEnd();
    return false;
  }
};

export const waitForPort = async (port: number, maxAttempts = 5): Promise<boolean> => {
  console.group(`Waiting for port ${port}`);
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Attempt ${i + 1}/${maxAttempts}...`);
    if (await checkPortAvailable(port)) {
      console.log(`✓ Port ${port} is now available`);
      console.groupEnd();
      return true;
    }
    console.log(`Waiting 2 seconds before next attempt...`);
    await delay(2000);
  }
  console.error(`❌ Port ${port} did not become available after ${maxAttempts} attempts`);
  console.groupEnd();
  return false;
};

export { delay };
