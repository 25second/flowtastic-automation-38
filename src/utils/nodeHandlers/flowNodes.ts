
import { FlowNodeWithData } from '@/types/flow';

export const handleFlowNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'flow-if':
      return `
    // Conditional branch
    const condition = ${node.data.settings?.condition || 'true'};
    if (!condition) {
      throw new Error('Condition not met: ${node.data.settings?.description || ''}');
    }`;

    case 'flow-loop':
      return `
    // Loop execution
    const loopCount = ${node.data.settings?.times || 1};
    for (let i = 0; i < loopCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }`;

    case 'flow-wait':
      return `
    // Wait for duration
    await new Promise(resolve => 
      setTimeout(resolve, ${node.data.settings?.duration || 1000})
    );`;

    default:
      return '';
  }
};
