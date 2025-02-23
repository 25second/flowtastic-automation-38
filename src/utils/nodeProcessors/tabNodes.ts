
import { FlowNodeWithData } from '@/types/flow';

export const processNewTabNode = (node: FlowNodeWithData) => {
  const url = node.data.settings?.url || '';
  return `
    // Create new tab
    console.log('Creating new tab...');
    if (!global.browser) {
      throw new Error('Browser not initialized');
    }
    const newPage = await global.browser.newPage();
    if (!newPage) {
      throw new Error('Failed to create new page');
    }
    ${url ? `await newPage.goto("${url}");` : ''}
    global.page = newPage;
  `;
};

export const processSwitchTabNode = (node: FlowNodeWithData) => {
  const fromIndex = node.data.settings?.fromIndex || 0;
  const toIndex = node.data.settings?.toIndex || 0;
  return `
    // Switch tab
    console.log('Switching tab from index ${fromIndex} to ${toIndex}...');
    if (!global.browser) {
      throw new Error('Browser not initialized');
    }
    const pages = await global.browser.contexts()[0].pages();
    if (${toIndex} >= pages.length) {
      throw new Error('Target tab index does not exist');
    }
    global.page = pages[${toIndex}];
    await global.page.bringToFront();
  `;
};

export const processWaitForTabNode = (node: FlowNodeWithData) => {
  const selector = node.data.settings?.selector || 'a[target="_blank"]';
  return `
    // Wait for new tab
    console.log('Waiting for new tab...');
    if (!global.browser) {
      throw new Error('Browser not initialized');
    }
    const [newPage] = await Promise.all([
      global.browser.contexts()[0].waitForEvent('page'),
      global.page.click('${selector}')
    ]);
    await newPage.waitForLoadState();
    global.page = newPage;
  `;
};

export const processCloseTabNode = (node: FlowNodeWithData) => {
  const index = node.data.settings?.index || 'current';
  return `
    // Close tab
    console.log('Closing tab...');
    if (!global.browser) {
      throw new Error('Browser not initialized');
    }
    const pages = await global.browser.contexts()[0].pages();
    ${index === 'current' 
      ? 'if (global.page) { await global.page.close(); }'
      : `if (${index} < pages.length) { await pages[${index}].close(); }`
    }
  `;
};
