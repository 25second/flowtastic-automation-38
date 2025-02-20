
import { FlowNodeWithData } from '@/types/flow';

export const processRunScriptNode = (node: FlowNodeWithData) => {
  const code = node.data.settings?.code || '';
  return `
    // Execute custom JavaScript
    console.log('Executing custom script...');
    const scriptResult = await global.page.evaluate(() => {
      ${code}
    });
    console.log('Script result:', scriptResult);
    global.lastScriptResult = scriptResult;`;
};
