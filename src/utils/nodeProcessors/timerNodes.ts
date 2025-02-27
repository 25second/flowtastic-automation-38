
import { FlowNodeWithData } from '@/types/flow';

export const processWaitTimeoutNode = (node: FlowNodeWithData) => {
  const timeout = node.data.settings?.timeout || 2000;
  return `
    // Wait for timeout
    console.log('Waiting for ${timeout}ms...');
    await page.waitForTimeout(${timeout});
  `;
};

export const processWaitElementNode = (node: FlowNodeWithData) => {
  const selector = node.data.settings?.selector || '.my-element';
  const timeout = node.data.settings?.timeout || 30000;
  return `
    // Wait for element to appear
    console.log('Waiting for element "${selector}" to appear...');
    await page.waitForSelector('${selector}', { timeout: ${timeout} });
  `;
};

export const processWaitElementHiddenNode = (node: FlowNodeWithData) => {
  const selector = node.data.settings?.selector || '.my-element';
  const timeout = node.data.settings?.timeout || 30000;
  return `
    // Wait for element to disappear
    console.log('Waiting for element "${selector}" to disappear...');
    await page.waitForSelector('${selector}', { state: 'hidden', timeout: ${timeout} });
  `;
};

export const processWaitFunctionNode = (node: FlowNodeWithData) => {
  const func = node.data.settings?.function || "() => document.querySelector('.my-element') !== null";
  const timeout = node.data.settings?.timeout || 30000;
  return `
    // Wait for function to return true
    console.log('Waiting for function condition...');
    await page.waitForFunction(${func}, { timeout: ${timeout} });
  `;
};

export const processWaitNavigationNode = (node: FlowNodeWithData) => {
  const selector = node.data.settings?.selector || 'a';
  const timeout = node.data.settings?.timeout || 30000;
  return `
    // Wait for navigation
    console.log('Waiting for navigation after clicking "${selector}"...');
    await Promise.all([
      page.waitForNavigation({ timeout: ${timeout} }),
      page.click('${selector}')
    ]);
  `;
};

export const processWaitLoadNode = (node: FlowNodeWithData) => {
  const state = node.data.settings?.state || 'networkidle';
  const timeout = node.data.settings?.timeout || 30000;
  return `
    // Wait for page load
    console.log('Waiting for page load state: ${state}...');
    const currentPage = pageStore.getCurrentPage();
    if (!currentPage) {
      throw new Error('No active page found');
    }
    console.log(\`Waiting for load state "\${state}" with timeout \${timeout}ms...\`);
    await currentPage.waitForLoadState('${state}', { timeout: ${timeout} });
    console.log(\`Successfully waited for load state "${state}"\`);
  `;
};

export const processWaitNetworkIdleNode = (node: FlowNodeWithData) => {
  const timeout = node.data.settings?.timeout || 30000;
  return `
    // Wait for network idle
    console.log('Waiting for network idle...');
    await page.waitForLoadState('networkidle', { timeout: ${timeout} });
  `;
};

export const processWaitDomLoadedNode = (node: FlowNodeWithData) => {
  const timeout = node.data.settings?.timeout || 30000;
  return `
    // Wait for DOM loaded
    console.log('Waiting for DOM content loaded...');
    await page.waitForLoadState('domcontentloaded', { timeout: ${timeout} });
  `;
};
