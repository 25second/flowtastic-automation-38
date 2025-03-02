
import { Node } from '@xyflow/react';

export const validateWorkflow = (nodes: Node[]) => {
  const startScriptNodes = nodes.filter(node => node.type === 'start-script');
  const stopNodes = nodes.filter(node => node.type === 'stop');

  if (startScriptNodes.length === 0 || stopNodes.length === 0) {
    throw new Error('Workflow must contain both Start Script and Stop nodes');
  }

  if (startScriptNodes.length > 1) {
    throw new Error('Only one Start Script node is allowed');
  }

  if (stopNodes.length > 1) {
    throw new Error('Only one Stop node is allowed');
  }
};
