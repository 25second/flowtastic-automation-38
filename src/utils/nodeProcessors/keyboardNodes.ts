
import { FlowNodeWithData } from '@/types/flow';

export const processKeyboardNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'keyboard-type':
      return `
    // Type text using keyboard
    console.log('Typing text:', "${node.data.settings?.text}");
    await global.page.keyboard.type("${node.data.settings?.text || ''}", { delay: ${node.data.settings?.delay || 0} });`;

    case 'keyboard-press':
      return `
    // Press keyboard key
    console.log('Pressing key:', "${node.data.settings?.key}");
    await global.page.keyboard.press("${node.data.settings?.key || 'Enter'}");`;

    case 'keyboard-down':
      return `
    // Hold down keyboard key
    console.log('Holding key:', "${node.data.settings?.key}");
    await global.page.keyboard.down("${node.data.settings?.key || 'Shift'}");
    await new Promise(resolve => setTimeout(resolve, ${node.data.settings?.duration || 1000}));
    await global.page.keyboard.up("${node.data.settings?.key || 'Shift'}");`;

    case 'keyboard-shortcut':
      return `
    // Execute keyboard shortcut
    console.log('Executing shortcut:', "${node.data.settings?.shortcut}");
    await global.page.keyboard.press("${node.data.settings?.shortcut || 'Control+C'}");`;

    case 'keyboard-focus-type':
      return `
    // Focus element and type text
    console.log('Focusing on element and typing:', "${node.data.settings?.selector}");
    await global.page.focus("${node.data.settings?.selector || ''}");
    await global.page.keyboard.type("${node.data.settings?.text || ''}", { delay: ${node.data.settings?.delay || 0} });`;

    default:
      return '';
  }
};
