
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
            timeout: 10000 
          }).catch(() => console.log('Navigation timeout - continuing anyway'));
          
          console.log('Page loaded, looking for element:', '${settings.selector}');
          
          // Evaluate if element exists and is interactable
          const isElementReady = await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (!element) return false;
            
            const style = window.getComputedStyle(element);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
          }, '${settings.selector}');

          if (!isElementReady) {
            throw new Error('Element is not interactable');
          }

          // Wait for element to be present
          const element = await page.waitForSelector('${settings.selector}', { 
            visible: true,
            timeout: 10000
          });
          
          if (!element) {
            throw new Error('Element not found after waiting');
          }

          // Clear the field first
          await element.evaluate(el => el.value = '');
          
          // Type the text directly using JavaScript
          await page.evaluate((selector, text) => {
            const element = document.querySelector(selector);
            if (element) {
              element.value = text;
              element.dispatchEvent(new Event('input', { bubbles: true }));
              element.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }, '${settings.selector}', '${settings.text || ''}');

          console.log('Text entered successfully');
          
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
