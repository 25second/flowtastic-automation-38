
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
        try {
          await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
          console.log('DOM content loaded');
          
          // Специальная обработка для YouTube
          const text = '${settings.text || ''}';
          
          // Находим поле поиска и вводим текст через JavaScript
          await page.evaluate((searchText) => {
            // Функция для поиска элемента во всех shadow roots
            function findElementInShadowRoots(root, selector) {
              if (!root) return null;
              
              // Проверяем текущий элемент
              let element = root.querySelector(selector);
              if (element) return element;
              
              // Проверяем все shadow roots
              const elements = root.querySelectorAll('*');
              for (const el of elements) {
                if (el.shadowRoot) {
                  element = findElementInShadowRoots(el.shadowRoot, selector);
                  if (element) return element;
                }
              }
              
              return null;
            }
            
            // Ищем поле ввода
            const searchInput = findElementInShadowRoots(document, 'input[name="search_query"]') ||
                              document.querySelector('input[name="search_query"]');
            
            if (searchInput) {
              // Очищаем поле
              searchInput.value = '';
              
              // Устанавливаем новое значение
              searchInput.value = searchText;
              
              // Эмулируем события
              searchInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
              searchInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
              
              // Фокус и клик
              searchInput.focus();
              searchInput.click();
              
              console.log('Input value set to:', searchInput.value);
            } else {
              throw new Error('Search input not found');
            }
          }, text);
          
          // Даем время для обработки событий
          await page.waitForTimeout(500);
          
          // Нажимаем Enter для отправки поиска
          await page.keyboard.press('Enter');
          
          console.log('Search submitted');
          
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
