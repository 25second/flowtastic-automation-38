
import { FlowNodeWithData } from '@/types/flow';

export const handleTabNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'tab-new':
      return `
    // Open new tab
    const newTab = window.open("${node.data.settings?.url || ''}", "_blank");
    if (newTab) {
      console.log('New tab opened');
    } else {
      throw new Error('Popup was blocked. Please allow popups for this site.');
    }`;

    case 'tab-close':
      return `
    // Close tab
    window.close();
    console.log('Tab closed');`;

    case 'tab-switch':
      return `
    // Note: Cannot switch tabs from console
    console.log('Tab switching is not available in console mode');`;

    default:
      return '';
  }
};
