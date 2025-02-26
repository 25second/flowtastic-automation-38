
import { FlowNodeWithData } from '@/types/flow';

export const processKeyboardNode = (
  node: FlowNodeWithData,
  connections: Array<{
    sourceNode?: FlowNodeWithData;
    sourceHandle?: string | null;
    targetHandle?: string | null;
  }> = []
): string => {
  const { type, data } = node;
  const settings = data.settings || {};

  switch (type) {
    case 'keyboard-type':
      return `
        // Type text
        await page.keyboard.type('${settings.text || ''}', { delay: ${settings.delay || 0} });
      `;

    case 'keyboard-press':
      return `
        // Press specific key
        await page.keyboard.press('${settings.key || 'Enter'}');
      `;

    case 'keyboard-down':
      return `
        // Hold key for duration
        await page.keyboard.down('${settings.key || 'Shift'}');
        await page.waitForTimeout(${settings.duration || 1000});
        await page.keyboard.up('${settings.key || 'Shift'}');
      `;

    case 'keyboard-shortcut':
      return `
        // Execute keyboard shortcut
        const shortcutKeys = '${settings.shortcut || 'Control+C'}'.split('+');
        for (const key of shortcutKeys) {
          await page.keyboard.down(key);
        }
        for (const key of shortcutKeys.reverse()) {
          await page.keyboard.up(key);
        }
      `;

    case 'keyboard-focus-type':
      return `
        // Wait for navigation to complete
        try {
          await page.waitForNavigation({ 
            waitUntil: 'domcontentloaded',
            timeout: 5000 
          }).catch(() => console.log('Navigation timeout - continuing anyway'));
          
          console.log('Page loaded, looking for element:', '${settings.selector}');
          
          // Wait for element to be present
          const element = await page.waitForSelector('${settings.selector}', { 
            visible: true,
            timeout: 5000
          });
          
          if (!element) {
            throw new Error('Element not found after waiting');
          }

          console.log('Element found, focusing and typing');
          await element.focus();
          await page.keyboard.type('${settings.text || ''}', { delay: ${settings.delay || 0} });
          console.log('Typing completed');
        } catch (error) {
          console.error('Error in keyboard-focus-type:', error.message);
          throw error;
        }
      `;

    default:
      console.error('Unknown keyboard node type:', type);
      throw new Error(`Unknown keyboard node type: ${type}`);
  }
};
