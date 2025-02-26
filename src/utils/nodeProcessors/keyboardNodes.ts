
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
          
          // Ждем загрузки контента
          await page.waitForTimeout(2000);
          
          const text = '${settings.text || ''}';
          
          // Расширенный поиск и взаимодействие с полем поиска
          const searchResult = await page.evaluate(() => {
            // Различные селекторы для поиска
            const selectors = [
              'input[name="search_query"]',
              'input#search',
              'input[aria-label*="Search"]',
              'input[aria-label*="search"]',
              'input[placeholder*="Search"]',
              'input[placeholder*="search"]',
              '#search input[type="text"]',
              'ytd-searchbox input',
              '#search-input input',
              '#masthead input[type="text"]',
              'header input[type="text"]'
            ];
            
            // Функция для проверки видимости элемента
            const isVisible = (element) => {
              const style = window.getComputedStyle(element);
              return style.display !== 'none' && 
                     style.visibility !== 'hidden' && 
                     style.opacity !== '0' &&
                     element.offsetWidth > 0 &&
                     element.offsetHeight > 0;
            };

            // Функция для поиска в shadow DOM
            const searchInShadowDOM = (root, selectors) => {
              if (!root) return null;
              
              // Проверяем селекторы в текущем root
              for (const selector of selectors) {
                const element = root.querySelector(selector);
                if (element && isVisible(element)) return element;
              }
              
              // Ищем во всех shadow roots
              const elements = root.querySelectorAll('*');
              for (const el of elements) {
                if (el.shadowRoot) {
                  const found = searchInShadowDOM(el.shadowRoot, selectors);
                  if (found) return found;
                }
              }
              
              return null;
            };

            // Ищем элемент во всем документе
            let searchInput = null;
            
            // Сначала пробуем найти через обычный querySelector
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element && isVisible(element)) {
                searchInput = element;
                break;
              }
            }
            
            // Если не нашли, ищем в shadow DOM
            if (!searchInput) {
              searchInput = searchInShadowDOM(document.documentElement, selectors);
            }

            // Если нашли элемент, возвращаем информацию о нём
            if (searchInput) {
              const rect = searchInput.getBoundingClientRect();
              return {
                found: true,
                tag: searchInput.tagName,
                id: searchInput.id,
                className: searchInput.className,
                type: searchInput.type,
                name: searchInput.name,
                position: {
                  x: rect.x,
                  y: rect.y,
                  width: rect.width,
                  height: rect.height
                }
              };
            }
            
            return { found: false };
          });
          
          console.log('Search element status:', searchResult);
          
          if (!searchResult.found) {
            throw new Error('Search input not found after extensive search');
          }
          
          // Используем точные координаты для клика
          if (searchResult.position) {
            const x = searchResult.position.x + searchResult.position.width / 2;
            const y = searchResult.position.y + searchResult.position.height / 2;
            
            // Кликаем по центру элемента
            await page.mouse.click(x, y);
            await page.waitForTimeout(500);
          }
          
          // Вводим текст
          await page.keyboard.type(text, { delay: 100 });
          await page.waitForTimeout(500);
          
          // Нажимаем Enter для отправки поиска
          await page.keyboard.press('Enter');
          
          console.log('Search action completed');
          
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
