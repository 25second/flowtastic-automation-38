
import tcpPortUsed from 'tcp-port-used';
import fetch from 'node-fetch';

export async function getChromeBrowsers() {
  let browsers = [];
  console.log('Checking for Chrome instances...');
  
  for (let port = 9222; port <= 9230; port++) {
    try {
      const inUse = await tcpPortUsed.check(port, 'localhost');
      console.log(`Port ${port} in use: ${inUse}`);
      
      if (inUse) {
        try {
          console.log(`Checking Chrome debugging endpoint on port ${port}...`);
          
          const response = await fetch(`http://localhost:${port}/json/version`, {
            signal: AbortSignal.timeout(2000)
          });

          if (response.ok) {
            const versionInfo = await response.json();
            console.log(`Found Chrome instance on port ${port}:`, versionInfo);
            
            browsers.push({
              port,
              name: `Chrome ${versionInfo.Browser || 'Unknown'} (port ${port})`,
              type: 'chrome'
            });
          } else {
            console.log(`No Chrome instance found on port ${port} (response not ok)`);
          }
        } catch (error) {
          console.log(`Error checking Chrome on port ${port}:`, error.message);
          console.log('To debug Chrome, start it with:');
          console.log(`chrome.exe --remote-debugging-port=${port}`);
          console.log('On macOS use: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');
          console.log('On Linux use: google-chrome --remote-debugging-port=9222');
        }
      }
    } catch (error) {
      console.error(`Error checking port ${port}:`, error);
    }
  }

  console.log('\nFound browsers:', browsers);
  return browsers;
}
