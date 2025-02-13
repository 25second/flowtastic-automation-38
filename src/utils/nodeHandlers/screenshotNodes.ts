
import { Node } from '@xyflow/react';

export const handleScreenshotNode = (node: Node) => {
  switch (node.type) {
    case 'screenshot-full':
    case 'screenshot-element':
      return `
    // Note: Screenshots are not available in console mode
    console.log('Screenshots are not available in console mode');`;

    default:
      return '';
  }
};
