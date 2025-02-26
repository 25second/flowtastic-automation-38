
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
          
          // Ждем появления элемента с увеличенным таймаутом
          const element = await page.waitForSelector('${settings.selector}', { 
            timeout: 30000,
            state: 'visible'
          });
          
          if (!element) {
            throw new Error('Element not found after waiting');
          }
          
          console.log('Element found, attempting to type');
          
          // Прокручиваем к элементу
          await element.scrollIntoViewIfNeeded();
          
          // Очищаем поле перед вводом
          await element.evaluate(el => {
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
              el.value = '';
            }
          });
          
          // Кликаем по элементу и фокусируемся
          await element.click({ delay: 100 });
          await element.focus();
          
          // Вводим текст
          const text = '${settings.text || ''}';
          await element.fill(text);
          
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
