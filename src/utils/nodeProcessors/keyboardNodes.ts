
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
          await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
          console.log('DOM content loaded');
          
          // Wait for network idle
          await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
            console.log('Network idle timeout - continuing anyway');
          });
          
          console.log('Page loaded, looking for element:', '${settings.selector}');
          
          // Ждем появления элемента в DOM
          const element = await page.waitForSelector('${settings.selector}', { 
            timeout: 30000,
            state: 'attached'
          });
          
          if (!element) {
            throw new Error('Element not found after waiting');
          }
          
          console.log('Element found, attempting to type');

          // Активируем элемент несколькими способами через JavaScript
          await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
              // 1. Делаем элемент видимым
              element.style.display = 'block';
              element.style.visibility = 'visible';
              element.style.opacity = '1';
              
              // 2. Пробуем разные способы активации
              element.focus();
              element.click();
              
              // 3. Удаляем возможные overlays
              const overlays = document.querySelectorAll('div[style*="position: fixed"], div[style*="position: absolute"]');
              overlays.forEach(overlay => {
                if (overlay.contains(element)) return;
                overlay.style.display = 'none';
              });
              
              // 4. Симулируем пользовательское взаимодействие
              element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
              element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
              element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
              element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            }
          }, '${settings.selector}');

          // Небольшая пауза после активации
          await page.waitForTimeout(500);
          
          const text = '${settings.text || ''}';
          
          // Пробуем ввести текст разными способами
          try {
            // 1. Пробуем через type
            await element.type(text, { delay: 100 });
          } catch (e) {
            console.log('Type failed, trying fill');
            try {
              // 2. Пробуем через fill
              await element.fill(text);
            } catch (e) {
              console.log('Fill failed, trying JavaScript input');
              // 3. Пробуем через JavaScript
              await page.evaluate((selector, value) => {
                const element = document.querySelector(selector);
                if (element) {
                  element.value = value;
                  element.dispatchEvent(new Event('input', { bubbles: true }));
                  element.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }, '${settings.selector}', text);
            }
          }
          
          // Проверяем результат
          const valueSet = await element.evaluate(el => 
            (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) ? el.value : null
          );
          
          console.log('Text entered:', valueSet);
          
          // Имитируем нажатие Enter для подтверждения ввода
          await element.press('Enter');
          
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
