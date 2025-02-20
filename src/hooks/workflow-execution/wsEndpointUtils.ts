
import { getActivePages } from './pageUtils';

export const findWebSocketEndpoint = async (port: number, sessionId: string): Promise<string | null> => {
  try {
    // First try to get version info
    const versionResponse = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (versionResponse.ok) {
      const versionInfo = await versionResponse.json();
      if (versionInfo.webSocketDebuggerUrl) {
        console.log('Found WebSocket URL in version info:', versionInfo.webSocketDebuggerUrl);
        return versionInfo.webSocketDebuggerUrl;
      }
    }

    // Then try to get active pages
    const pages = await getActivePages(port);
    console.log('Active pages:', pages);

    if (pages.length > 0) {
      // First, try to find a page with webSocketDebuggerUrl
      const pageWithWs = pages.find(page => page.webSocketDebuggerUrl);
      if (pageWithWs) {
        console.log('Found page with WebSocket URL:', pageWithWs.webSocketDebuggerUrl);
        return pageWithWs.webSocketDebuggerUrl;
      }

      // Try to extract from devtoolsFrontendUrl
      const pageWithDevtools = pages.find(page => page.devtoolsFrontendUrl);
      if (pageWithDevtools) {
        const match = pageWithDevtools.devtoolsFrontendUrl.match(/ws=([^&]+)/);
        if (match) {
          const wsUrl = decodeURIComponent(match[1]);
          console.log('Extracted WebSocket URL from devtools URL:', wsUrl);
          return wsUrl;
        }
      }

      // Use the first page's ID to construct endpoint
      if (pages[0].id) {
        const wsUrl = `ws://127.0.0.1:${port}/devtools/page/${pages[0].id}`;
        console.log('Constructed WebSocket URL from page ID:', wsUrl);
        return wsUrl;
      }
    }

    // Try browser endpoint with session ID
    try {
      const response = await fetch(`http://127.0.0.1:${port}/devtools/page/${sessionId}`);
      if (response.ok) {
        const wsUrl = `ws://127.0.0.1:${port}/devtools/page/${sessionId}`;
        console.log('Using page-specific WebSocket URL:', wsUrl);
        return wsUrl;
      }
    } catch (error) {
      console.warn('Failed to connect to page-specific endpoint:', error);
    }

    // Default to a basic page endpoint
    return `ws://127.0.0.1:${port}/devtools/page/`;
  } catch (error) {
    console.error('Error finding WebSocket endpoint:', error);
    return null;
  }
};
