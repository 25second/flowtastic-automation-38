
import { getActivePages } from './pageUtils';

export const findWebSocketEndpoint = async (port: number, sessionId: string): Promise<string | null> => {
  console.group('WebSocket Endpoint Discovery');
  try {
    // Version info check through server
    console.log(`1. Checking version endpoint for port ${port}...`);
    const versionResponse = await fetch(`http://localhost:3001/ports/version?port=${port}`);
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

    // Active pages check through server
    console.log(`2. Getting active pages for port ${port}...`);
    const pagesResponse = await fetch(`http://localhost:3001/ports/list?port=${port}`);
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

    // Try direct WebSocket connection
    console.log('6. Trying direct WebSocket connection...');
    const directWsUrl = `ws://127.0.0.1:${port}/devtools/browser`;
    console.log('✓ Using direct WebSocket URL:', directWsUrl);
    
    // Fallback to session-specific endpoint
    console.log('7. Trying session-specific endpoint...');
    const sessionWsUrl = `ws://127.0.0.1:${port}/devtools/page/${sessionId}`;
    console.log('✓ Using session-specific endpoint:', sessionWsUrl);
    console.groupEnd();
    
    // Try both approaches - first direct then session-specific
    return directWsUrl;

  } catch (error) {
    console.error('❌ Error finding WebSocket endpoint:', error);
    console.groupEnd();
    return null;
  }
};
