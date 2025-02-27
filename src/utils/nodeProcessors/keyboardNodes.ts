
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
      // Получаем значение из узла-источника
      const sourceNodeId = textConnection.sourceNode.id;
      const sourceHandle = textConnection.sourceHandle || 'email';
      
      return `
        (() => {
          console.log('Checking global.nodeOutputs:', global.nodeOutputs);
          console.log('Checking source node:', '${sourceNodeId}');
          console.log('Looking for handle:', '${sourceHandle}');
          
          if (!global.nodeOutputs['${sourceNodeId}']) {
            console.error('No outputs found for node:', '${sourceNodeId}');
            return '${settings.text || ''}';
          }
          
          const value = global.nodeOutputs['${sourceNodeId}']['${sourceHandle}'];
          console.log('Retrieved value:', value);
          
          if (!value && value !== '') {
            console.log('No value found for handle:', '${sourceHandle}');
            return '${settings.text || ''}';
          }
          
          return value;
        })()
      `;
    }
    return `'${settings.text || ''}'`;
  };

  switch (type) {
    case 'keyboard-type':
      return `
        // Type text
        const textToType = ${getTextValue()};
        if (!textToType) {
          throw new Error('Text to type is empty');
        }
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
          
          // Get text from connection or settings with detailed logging
          console.log('Getting text value...');
          const text = ${getTextValue()};
          console.log('Raw text value:', text);
          
          if (!text && text !== '') {
            console.log('No text value available from connection or settings');
            throw new Error('Text value is empty');
          }
          
          console.log('Text to type:', text);
          
          // Use selector from settings
          const selector = '${settings.selector || 'input'}';
          console.log('Using selector:', selector);
          
          // Wait for element to be available in DOM
          await currentPage.waitForSelector(selector, { timeout: 10000 })
            .catch(() => {
              console.log(\`Element not found with selector: \${selector}\`);
              throw new Error(\`Element not found with selector: \${selector}\`);
            });
          
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
            
            // Press Enter if specified
            if (${settings.pressEnter || false}) {
              await currentPage.keyboard.press('Enter');
            }
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
