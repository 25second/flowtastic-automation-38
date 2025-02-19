
import { FlowNodeWithData } from '@/types/flow';

export const handleTabNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'tab-new':
      return `
    // Open new tab
    const newTab = window.open("${node.data.settings?.url || ''}", "_blank");
    if (!newTab) {
      throw new Error('Failed to open new tab. Popup might be blocked.');
    }`;

    case 'tab-close':
      return `
    // Close current tab
    window.close();`;

    case 'tab-switch':
      return `
    // Switch tab focus
    window.focus();`;

    default:
      return '';
  }
};
