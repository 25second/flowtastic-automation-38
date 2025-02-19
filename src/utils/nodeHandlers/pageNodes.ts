
import { FlowNodeWithData } from '@/types/flow';

export const handlePageNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'page-click':
      return `
    // Click element
    await page.waitForSelector("${node.data.settings?.selector || ''}", { timeout: 5000 });
    await page.click("${node.data.settings?.selector || ''}");
    console.log('Clicked element:', "${node.data.settings?.selector}");`;

    case 'page-type':
      return `
    // Type text
    await page.waitForSelector("${node.data.settings?.selector || ''}", { timeout: 5000 });
    await page.type("${node.data.settings?.selector || ''}", "${node.data.settings?.text || ''}", { delay: 100 });
    console.log('Typed text into:', "${node.data.settings?.selector}");`;

    case 'page-scroll':
      return `
    // Scroll page
    ${node.data.settings?.selector ? 
      `await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, "${node.data.settings.selector}");` 
      : 
      `await page.evaluate(() => {
        window.scrollTo({
          top: ${node.data.settings?.scrollY || 0},
          behavior: "smooth"
        });
      });`
    }
    console.log('Scrolled to:', "${node.data.settings?.selector || 'specified position'}");`;

    default:
      return '';
  }
};
