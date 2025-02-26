
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
          
          const text = '${settings.text || ''}';
          
          // Wait for search input to be available in DOM
          await currentPage.waitForSelector('input[name="search_query"]', { timeout: 10000 })
            .catch(() => console.log('Standard search input not found, trying alternative methods'));
          
          // Attempt to interact with search input
          const searchResult = await currentPage.evaluate(() => {
            const searchInput = document.querySelector('input[name="search_query"]') || 
                              document.querySelector('input#search') ||
                              document.querySelector('input[type="text"]');
            
            if (searchInput) {
              const rect = searchInput.getBoundingClientRect();
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
          });
          
          console.log('Search element status:', searchResult);
          
          if (!searchResult.found) {
            throw new Error('Search input not found after extensive search');
          }
          
          // Click the search input
          if (searchResult.position) {
            const x = searchResult.position.x + searchResult.position.width / 2;
            const y = searchResult.position.y + searchResult.position.height / 2;
            
            await currentPage.mouse.click(x, y);
            await currentPage.waitForTimeout(500);
            
            // Type the text with delay
            await currentPage.keyboard.type(text, { delay: 100 });
            await currentPage.waitForTimeout(500);
            
            // Press Enter
            await currentPage.keyboard.press('Enter');
          }
          
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
