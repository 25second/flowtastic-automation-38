
import { FlowNodeWithData } from '@/types/flow';

export const processKeyboardNode = (node: FlowNodeWithData, connections: any[]) => {
  const settings = node.data.settings || {};
  
  switch (node.type) {
    case 'keyboard-type': {
      let text = settings.text || '';
      
      // Check if text should come from a connection
      const textConnection = connections.find(conn => conn.targetHandle === 'setting-text');
      if (textConnection) {
        text = `global.getNodeOutput('${textConnection.sourceNode.id}', '${textConnection.sourceHandle}')`;
      } else {
        text = `"${text}"`;
      }

      return `
    // Type text using keyboard
    const textToType = ${text};
    console.log('Typing text:', textToType);
    if (!global.page) {
      global.page = await global.browser.newPage();
    }
    await global.page.keyboard.type(textToType, { delay: ${settings.delay || 0} });`;
    }

    case 'keyboard-press':
      return `
    // Press key
    if (!global.page) {
      global.page = await global.browser.newPage();
    }
    await global.page.keyboard.press("${settings.key || 'Enter'}");`;

    case 'keyboard-down':
      return `
    // Hold key
    if (!global.page) {
      global.page = await global.browser.newPage();
    }
    await global.page.keyboard.down("${settings.key || 'Shift'}");
    await new Promise(resolve => setTimeout(resolve, ${settings.duration || 1000}));
    await global.page.keyboard.up("${settings.key || 'Shift'}");`;

    case 'keyboard-shortcut':
      return `
    // Press keyboard shortcut
    if (!global.page) {
      global.page = await global.browser.newPage();
    }
    const keys = "${settings.shortcut || 'Control+C'}".split('+');
    for (const key of keys) {
      await global.page.keyboard.down(key);
    }
    for (const key of keys.reverse()) {
      await global.page.keyboard.up(key);
    }`;

    default:
      return `
    console.error('Unknown keyboard node type:', '${node.type}');
    throw new Error('Unknown keyboard node type: ${node.type}');`;
  }
};
