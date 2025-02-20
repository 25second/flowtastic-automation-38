
import { FlowNodeWithData } from '@/types/flow';

export const processOpenPageNode = (node: FlowNodeWithData) => {
  const url = node.data.settings?.url || 'about:blank';
  return `
    // Open new page
    console.log('Opening new page:', "${url}");
    const page = await global.browser.newPage();
    await page.goto("${url}", { waitUntil: 'networkidle0' });
    global.page = page;`;
};

export const processNavigateNode = (node: FlowNodeWithData) => {
  const direction = node.data.settings?.direction || 'back';
  return `
    // Navigate ${direction}
    console.log('Navigating ${direction}...');
    await global.page.${direction}();`;
};

export const processCloseTabNode = () => `
    // Close current tab
    console.log('Closing current tab...');
    await global.page.close();`;
