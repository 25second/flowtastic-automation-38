
import { FlowNodeWithData } from '@/types/flow';

export const processOpenPageNode = (node: FlowNodeWithData) => {
  const url = node.data.settings?.url || 'about:blank';
  return `
    // Open new page
    console.log('Opening new page:', "${url}");
    if (!global.browser) {
      throw new Error('Browser connection not initialized');
    }
    const page = await global.browser.newPage();
    if (!page) {
      throw new Error('Failed to create new page');
    }
    await page.goto("${url}", { waitUntil: 'networkidle' });
    global.page = page;`;
};

export const processNavigateNode = (node: FlowNodeWithData) => {
  const direction = node.data.settings?.direction || 'back';
  return `
    // Navigate ${direction}
    console.log('Navigating ${direction}...');
    if (!global.page) {
      throw new Error('No active page found');
    }
    await global.page.${direction}();`;
};

export const processCloseTabNode = () => `
    // Close current tab
    console.log('Closing current tab...');
    if (!global.page) {
      throw new Error('No active page found');
    }
    await global.page.close();`;
