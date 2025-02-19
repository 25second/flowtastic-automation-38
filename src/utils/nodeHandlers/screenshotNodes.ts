
import { FlowNodeWithData } from '@/types/flow';

export const handleScreenshotNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'screenshot-full':
      return `
    // Take full page screenshot
    // Note: This requires additional browser permissions
    const fullCanvas = await html2canvas(document.body);
    const fullScreenshot = fullCanvas.toDataURL('image/png');`;

    case 'screenshot-element':
      return `
    // Take element screenshot
    const element = document.querySelector("${node.data.settings?.selector || ''}");
    if (!element) {
      throw new Error('Screenshot target element not found');
    }
    const elementCanvas = await html2canvas(element);
    const elementScreenshot = elementCanvas.toDataURL('image/png');`;

    default:
      return '';
  }
};
