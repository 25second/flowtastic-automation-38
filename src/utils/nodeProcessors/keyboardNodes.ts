
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

  // Проверяем, есть ли входящее соединение для текста
  const textConnection = connections.find(conn => 
    conn.targetHandle === 'setting-text' || 
    conn.targetHandle === 'text'
  );

  // Получаем текст либо из соединения, либо из настроек
  const getTextValue = () => {
    if (textConnection?.sourceNode) {
      if (textConnection.sourceHandle === 'email') {
        // Если источник - email, возвращаем прямое значение из узла
        return `global.getNodeOutput('${textConnection.sourceNode.id}', 'email')`;
      }
      // Для других случаев используем общий подход
      return `global.getNodeOutput('${textConnection.sourceNode.id}', '${textConnection.sourceHandle}')`;
    }
    return `'${settings.text || ''}'`;
  };

  switch (type) {
    case 'keyboard-type':
      return `
        // Type text
        const textToType = ${getTextValue()};
        await page.keyboard.type(textToType, { delay: ${settings.delay || 0} });
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
          // Ensure we're using the correct page from pageStore
          const currentPage = pageStore.getCurrentPage();
          if (!currentPage) {
            throw new Error('No active page found');
          }
          
          // Wait for page load
          await currentPage.waitForLoadState('domcontentloaded', { timeout: 30000 });
          console.log('DOM content loaded');
          
          // Additional wait for dynamic content
          await currentPage.waitForTimeout(2000);
          
          // Get text from connection or settings
          const text = await ${getTextValue()};
          if (typeof text !== 'string') {
            throw new Error(\`Invalid text value: \${text}\`);
          }
          console.log('Text to type:', text);
          
          // Use selector from settings
          const selector = '${settings.selector || 'input'}';
          console.log('Using selector:', selector);
          
          // Wait for element to be available in DOM
          await currentPage.waitForSelector(selector, { timeout: 10000 })
            .catch(() => console.log(\`Element not found with selector: \${selector}\`));
          
          // Attempt to interact with input
          const elementResult = await currentPage.evaluate((sel) => {
            const element = document.querySelector(sel);
            
            if (element) {
              const rect = element.getBoundingClientRect();
              return {
                found: true,
                position: {
                  x: rect.x,
                  y: rect.y,
                  width: rect.width,
                  height: rect.height
                }
              };
            }
            return { found: false };
          }, selector);
          
          console.log('Element status:', elementResult);
          
          if (!elementResult.found) {
            throw new Error(\`Element not found with selector: \${selector}\`);
          }
          
          // Click the element
          if (elementResult.position) {
            const x = elementResult.position.x + elementResult.position.width / 2;
            const y = elementResult.position.y + elementResult.position.height / 2;
            
            await currentPage.mouse.click(x, y);
            await currentPage.waitForTimeout(500);
            
            // Type the text with delay
            await currentPage.keyboard.type(text, { delay: 100 });
            await currentPage.waitForTimeout(500);
            
            // Press Enter
            await currentPage.keyboard.press('Enter');
          }
          
          console.log('Input action completed');
          
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
