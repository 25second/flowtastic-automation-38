
export const getActivePages = async (port: number): Promise<any[]> => {
  console.group('Getting Active Pages');
  try {
    // Try /json/list first (Chrome DevTools Protocol v1.3+)
    console.log('1. Trying /json/list endpoint...');
    const listResponse = await fetch(`http://127.0.0.1:${port}/json/list`);
    if (listResponse.ok) {
      const pages = await listResponse.json();
      console.log('✓ Got pages from /json/list:', pages);
      console.groupEnd();
      return pages;
    } else {
      console.log('⚠️ /json/list endpoint not available');
    }

    // Fallback to /json (older versions)
    console.log('2. Trying /json endpoint...');
    const jsonResponse = await fetch(`http://127.0.0.1:${port}/json`);
    if (jsonResponse.ok) {
      const pages = await jsonResponse.json();
      console.log('✓ Got pages from /json:', pages);
      console.groupEnd();
      return pages;
    } else {
      console.log('⚠️ /json endpoint not available');
    }

    console.log('❌ No pages found through any endpoint');
    console.groupEnd();
    return [];
  } catch (error) {
    console.error('❌ Error getting active pages:', error);
    console.groupEnd();
    return [];
  }
};
