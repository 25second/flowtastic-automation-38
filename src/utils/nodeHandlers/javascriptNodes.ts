
import { FlowNodeWithData } from '@/types/flow';

export const handleJavaScriptNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'js-execute':
      return `
    // Execute custom JavaScript
    const executeResult = await (async () => {
      ${node.data.settings?.code || '// No code provided'}
    })();`;

    case 'js-evaluate':
      return `
    // Evaluate JavaScript expression
    const evaluateResult = await (async () => {
      return ${node.data.settings?.expression || 'null'};
    })();`;

    default:
      return '';
  }
};
