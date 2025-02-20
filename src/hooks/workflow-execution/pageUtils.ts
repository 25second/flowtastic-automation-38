
export const getActivePages = async (port: number): Promise<any[]> => {
  try {
    // Try /json/list first (Chrome DevTools Protocol v1.3+)
    const listResponse = await fetch(`http://127.0.0.1:${port}/json/list`);
    if (listResponse.ok) {
      const pages = await listResponse.json();
      console.log('Got pages from /json/list:', pages);
      return pages;
    }

    // Fallback to /json (older versions)
    const jsonResponse = await fetch(`http://127.0.0.1:${port}/json`);
    if (jsonResponse.ok) {
      const pages = await jsonResponse.json();
      console.log('Got pages from /json:', pages);
      return pages;
    }

    return [];
  } catch (error) {
    console.warn('Failed to get active pages:', error);
    return [];
  }
};
