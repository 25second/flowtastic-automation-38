
import { FlowNodeWithData } from '@/types/flow';

export const processWaitNode = (node: FlowNodeWithData) => {
  const mode = node.data.settings?.mode || 'delay';
  const value = node.data.settings?.value || 1000;
  const selector = node.data.settings?.selector || '';
  return `
    // Wait
    console.log('Waiting...');
    ${mode === 'delay' 
      ? `await new Promise(resolve => setTimeout(resolve, ${value}));`
      : `await global.page.waitForSelector("${selector}");`}`;
};

export const processConditionNode = (node: FlowNodeWithData) => {
  const condition = node.data.settings?.condition || 'true';
  return `
    // Check condition
    console.log('Checking condition:', "${condition}");
    const conditionResult = await global.page.evaluate(() => {
      return ${condition};
    });
    if (!conditionResult) {
      throw new Error('Condition not met');
    }`;
};
