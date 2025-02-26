
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
      await newPage.goto('${settings.url}', { waitUntil: 'networkidle' });
      pageStore.setActivePage('${node.id}', newPage);
      global.page = newPage;
      console.log('Created new tab and navigated to URL');`;
      } else {
        return `
      // Create new tab in current browser window without URL
      const newPage = await context.newPage();
      pageStore.setActivePage('${node.id}', newPage);
      global.page = newPage;
      console.log('Created new empty tab');`;
      }

    case 'switch-tab':
      return `
      // Switch to tab by index
      const pages = await context.pages();
      const targetIndex = ${settings.toIndex || 0};
      if (pages[targetIndex]) {
        await pages[targetIndex].bringToFront();
        pageStore.setActivePage('${node.id}', pages[targetIndex]);
        global.page = pages[targetIndex];
        console.log('Switched to tab at index:', targetIndex);
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
          pageStore.setActivePage('${node.id}', newPage);
          global.page = newPage;
          console.log('New tab opened and loaded');
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
        pageStore.setActivePage('${node.id}', remainingPages[0]);
        global.page = remainingPages[0];
      }
      console.log('Closed current tab');`;
      } else {
        return `
      // Close specific tab by index
      const allPages = await context.pages();
      const tabIndex = ${settings.index || 0};
      if (allPages[tabIndex]) {
        await allPages[tabIndex].close();
      }
      if (global.page === allPages[tabIndex]) {
        const newActivePage = (await context.pages())[0];
        pageStore.setActivePage('${node.id}', newActivePage);
        global.page = newActivePage;
      }
      console.log('Closed tab at index:', tabIndex);`;
      }

    case 'reload-page':
      return `
      // Reload current page
      await page.reload({ waitUntil: '${settings.waitUntil || 'load'}' });
      console.log('Page reloaded');`;

    default:
      return '';
  }
};
