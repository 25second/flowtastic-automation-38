
import { FlowNodeWithData } from '@/types/flow';

export const handleTriggerNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'trigger-schedule':
      return `
    // Schedule trigger
    const now = new Date();
    const cronExpression = "${node.data.settings?.cronExpression || '* * * * *'}";
    // Note: Actual cron execution would need to be handled by a backend service`;

    case 'trigger-event':
      return `
    // Event trigger
    await new Promise((resolve) => {
      const handler = () => {
        document.removeEventListener("${node.data.settings?.eventType || 'click'}", handler);
        resolve();
      };
      document.addEventListener("${node.data.settings?.eventType || 'click'}", handler);
    });`;

    default:
      return '';
  }
};
