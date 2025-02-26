
import { FlowNodeWithData } from "@/types/flow";

export const processTabNode = (node: FlowNodeWithData): string => {
  const { type, data } = node;
  const settings = data.settings || {};

  switch (type) {
    case 'new-tab':
      if (settings.url) {
        return `
      // Create new tab in current browser window and navigate to URL
      const newPage = await context.newPage();
      await newPage.goto('${settings.url}', { waitUntil: 'networkidle0' });
      global.page = newPage;`;
      } else {
        return `
      // Create new tab in current browser window without URL
      const newPage = await context.newPage();
      global.page = newPage;`;
      }

    case 'switch-tab':
      return `
      // Switch to tab by index
      const pages = await context.pages();
      const targetIndex = ${settings.toIndex || 0};
      if (pages[targetIndex]) {
        await pages[targetIndex].bringToFront();
        global.page = pages[targetIndex];
      } else {
        throw new Error('Target tab index not found');
      }`;

    case 'wait-for-tab':
      return `
      // Wait for new tab to open
      const currentPages = await context.pages();
      const startCount = currentPages.length;
      ${settings.selector ? `await page.click('${settings.selector}');` : ''}
      await new Promise(resolve => {
        context.once('page', async (newPage) => {
          await newPage.waitForLoadState('networkidle');
          global.page = newPage;
          resolve(true);
        });
      });`;

    case 'close-tab':
      if (settings.index === 'current') {
        return `
      // Close current tab
      await page.close();
      const remainingPages = await context.pages();
      if (remainingPages.length > 0) {
        global.page = remainingPages[0];
      }`;
      } else {
        return `
      // Close specific tab by index
      const allPages = await context.pages();
      const tabIndex = ${settings.index || 0};
      if (allPages[tabIndex]) {
        await allPages[tabIndex].close();
      }
      if (global.page === allPages[tabIndex]) {
        global.page = (await context.pages())[0];
      }`;
      }

    case 'reload-page':
      return `
      // Reload current page
      await page.reload({ waitUntil: '${settings.waitUntil || 'load'}' });`;

    default:
      return '';
  }
};
