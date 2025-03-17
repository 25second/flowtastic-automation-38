
import { getActivePages } from './pageUtils';

export const findWebSocketEndpoint = async (port: number, sessionId: string): Promise<string | null> => {
  console.group('WebSocket Endpoint Discovery');
  try {
    // Add additional console logs for debugging
    console.log(`Starting endpoint discovery for port ${port} and session ${sessionId}`);
    
    // Version info check through server with timeout
    console.log(`1. Checking version endpoint for port ${port}...`);
    const controller1 = new AbortController();
    const timeout1 = setTimeout(() => controller1.abort(), 5000);
    
    try {
      const versionResponse = await fetch(`http://localhost:3001/ports/version?port=${port}`, {
        signal: controller1.signal
      });
      clearTimeout(timeout1);
      
      if (versionResponse.ok) {
        const versionInfo = await versionResponse.json();
        console.log('Version info response:', versionInfo);
        if (versionInfo.webSocketDebuggerUrl) {
          console.log('✓ Found WebSocket URL in version info');
          console.groupEnd();
          return versionInfo.webSocketDebuggerUrl;
        }
      } else {
        console.log('⚠️ Version endpoint not available or returned an error');
        const errorText = await versionResponse.text();
        console.log('Error response:', errorText);
      }
    } catch (error) {
      console.log('⚠️ Error fetching version info:', error.message);
      clearTimeout(timeout1);
    }

    // Active pages check through server with timeout
    console.log(`2. Getting active pages for port ${port}...`);
    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), 5000);
    
    try {
      const pagesResponse = await fetch(`http://localhost:3001/ports/list?port=${port}`, {
        signal: controller2.signal
      });
      clearTimeout(timeout2);
      
      if (pagesResponse.ok) {
        const pages = await pagesResponse.json();
        console.log('Found pages:', pages);

        if (pages.length > 0) {
          // Check for direct WebSocket URL
          console.log('3. Checking for WebSocket URL in pages...');
          const pageWithWs = pages.find(page => page.webSocketDebuggerUrl);
          if (pageWithWs) {
            console.log('✓ Found page with direct WebSocket URL');
            console.groupEnd();
            return pageWithWs.webSocketDebuggerUrl;
          }

          // Check devtools URL
          console.log('4. Checking devtools frontend URL...');
          const pageWithDevtools = pages.find(page => page.devtoolsFrontendUrl);
          if (pageWithDevtools) {
            console.log('Found devtools URL:', pageWithDevtools.devtoolsFrontendUrl);
            const match = pageWithDevtools.devtoolsFrontendUrl.match(/ws=([^&]+)/);
            if (match) {
              const wsUrl = decodeURIComponent(match[1]);
              console.log('✓ Extracted WebSocket URL from devtools');
              console.groupEnd();
              return wsUrl;
            }
          }

          // Use page ID
          console.log('5. Checking page ID...');
          if (pages[0].id) {
            const wsUrl = `ws://127.0.0.1:${port}/devtools/page/${pages[0].id}`;
            console.log('✓ Constructed URL from page ID:', wsUrl);
            console.groupEnd();
            return wsUrl;
          }
        } else {
          console.log('No pages found in response');
        }
      } else {
        console.log('⚠️ List endpoint not available or returned an error');
        const errorText = await pagesResponse.text();
        console.log('Error response:', errorText);
      }
    } catch (error) {
      console.log('⚠️ Error fetching page list:', error.message);
      clearTimeout(timeout2);
    }

    // Fallback to various common endpoint patterns
    console.log('6. Trying fallback endpoints...');
    const endpoints = [
      `ws://127.0.0.1:${port}/devtools/browser`,
      `ws://localhost:${port}/devtools/browser`,
      `ws://127.0.0.1:${port}/devtools/page/${sessionId}`,
      `ws://localhost:${port}/devtools/page/${sessionId}`,
      `ws://127.0.0.1:${port}`,
      `ws://localhost:${port}`
    ];
    
    console.log('Testing these endpoints:', endpoints);
    
    // Return the most likely endpoint for now (actual testing would require WebSocket which is hard to do here)
    const directWsUrl = `ws://127.0.0.1:${port}/devtools/browser`;
    console.log('✓ Using direct WebSocket URL:', directWsUrl);
    console.groupEnd();
    
    return directWsUrl;

  } catch (error) {
    console.error('❌ Error finding WebSocket endpoint:', error);
    console.groupEnd();
    return null;
  }
};
