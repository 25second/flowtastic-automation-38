
import { FlowNodeWithData } from '@/types/flow';

export const handleJavaScriptNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'js-execute':
      return `
    // Execute JavaScript
    try {
      ${node.data.settings?.code || '// No code provided'}
      console.log('Custom JavaScript executed');
    } catch (error) {
      throw new Error('Code execution failed: ' + error.message);
    }`;

    case 'js-evaluate':
      return `
    // Evaluate JavaScript expression
    try {
      const result = ${node.data.settings?.expression || ''};
      console.log('Expression result:', result);
    } catch (error) {
      throw new Error('Expression evaluation failed: ' + error.message);
    }`;

    default:
      return '';
  }
};
