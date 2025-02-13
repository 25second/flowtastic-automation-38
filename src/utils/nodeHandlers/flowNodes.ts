
import { Node } from '@xyflow/react';

export const handleFlowNode = (node: Node) => {
  switch (node.type) {
    case 'flow-if':
      return `
    // Conditional branch
    if (${node.data.settings?.condition || 'true'}) {
      console.log('Condition met:', "${node.data.settings?.description || ''}");
    }`;

    case 'flow-loop':
      return `
    // Loop
    for (let i = 0; i < ${node.data.settings?.times || 1}; i++) {
      console.log('Loop iteration:', i + 1);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Prevent too rapid execution
    }`;

    case 'flow-wait':
      return `
    // Wait
    await new Promise(resolve => setTimeout(resolve, ${node.data.settings?.duration || 1000}));
    console.log('Waited for ${node.data.settings?.duration || 1000}ms');`;

    default:
      return '';
  }
};
