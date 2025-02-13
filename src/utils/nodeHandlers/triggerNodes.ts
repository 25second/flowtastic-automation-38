
import { Node } from '@xyflow/react';

export const handleTriggerNode = (node: Node) => {
  switch (node.type) {
    case 'trigger-schedule':
      return `
    // Schedule trigger
    const schedule = "${node.data.settings?.cronExpression || '* * * * *'}";
    console.log('Schedule would run at:', schedule);`;

    case 'trigger-event':
      return `
    // Event trigger
    console.log('Waiting for event:', "${node.data.settings?.eventType}");
    await new Promise(resolve => setTimeout(resolve, ${node.data.settings?.delay || 0}));`;

    default:
      return '';
  }
};
