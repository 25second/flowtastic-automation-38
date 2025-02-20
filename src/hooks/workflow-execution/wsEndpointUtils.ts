
import { getActivePages } from './pageUtils';

export const findWebSocketEndpoint = async (port: number, sessionId: string): Promise<string | null> => {
  console.group('WebSocket Endpoint Discovery');
  try {
    // Version info check
    console.log('1. Checking version endpoint...');
    const versionResponse = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (versionResponse.ok) {
      const versionInfo = await versionResponse.json();
      console.log('Version info response:', versionInfo);
      if (versionInfo.webSocketDebuggerUrl) {
        console.log('✓ Found WebSocket URL in version info');
        console.groupEnd();
        return versionInfo.webSocketDebuggerUrl;
      }
    } else {
      console.log('⚠️ Version endpoint not available');
    }

    // Active pages check
    console.log('2. Getting active pages...');
    const pages = await getActivePages(port);
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
        console.log('✓ Constructed URL from page ID');
        console.groupEnd();
        return wsUrl;
      }
    }

    // Session-specific endpoint
    console.log('6. Trying session-specific endpoint...');
    try {
      const response = await fetch(`http://127.0.0.1:${port}/devtools/page/${sessionId}`);
      if (response.ok) {
        const wsUrl = `ws://127.0.0.1:${port}/devtools/page/${sessionId}`;
        console.log('✓ Session-specific endpoint available');
        console.groupEnd();
        return wsUrl;
      }
    } catch (error) {
      console.warn('⚠️ Session-specific endpoint not available:', error);
    }

    // Fallback
    console.log('7. Using fallback endpoint');
    console.groupEnd();
    return `ws://127.0.0.1:${port}/devtools/page/`;
  } catch (error) {
    console.error('❌ Error finding WebSocket endpoint:', error);
    console.groupEnd();
    return null;
  }
};
