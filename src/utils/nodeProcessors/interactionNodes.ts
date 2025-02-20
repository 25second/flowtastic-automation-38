
import { FlowNodeWithData } from '@/types/flow';

export const processClickNode = (node: FlowNodeWithData) => {
  const selector = node.data.settings?.selector || '';
  const clickType = node.data.settings?.clickType || 'single';
  const delay = node.data.settings?.delay || 0;
  return `
    // Click element
    console.log('Clicking element:', "${selector}");
    const element = await global.page.waitForSelector("${selector}");
    if (${delay} > 0) {
      await new Promise(resolve => setTimeout(resolve, ${delay}));
    }
    await element.click(${clickType === 'double' ? '{ clickCount: 2 }' : ''});`;
};

export const processInputNode = (node: FlowNodeWithData) => {
  const selector = node.data.settings?.selector || '';
  const text = node.data.settings?.text || '';
  const clearBefore = node.data.settings?.clearBefore || false;
  const delay = node.data.settings?.delay || 0;
  return `
    // Input text
    console.log('Typing text into:', "${selector}");
    const element = await global.page.waitForSelector("${selector}");
    ${clearBefore ? 'await element.click({ clickCount: 3 });' : ''}
    ${delay > 0 ? 'await new Promise(resolve => setTimeout(resolve, ' + delay + '));' : ''}
    await element.type("${text}");`;
};
