
import { FlowNodeWithData } from '@/types/flow';

export const handlePageNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'page-click':
      return `
    // Click element
    const clickElement = async () => {
      const element = await document.querySelector("${node.data.settings?.selector || ''}");
      if (element) {
        element.click();
      } else {
        throw new Error("Element not found: ${node.data.settings?.selector || ''}");
      }
    };
    await clickElement();`;

    case 'page-type':
      return `
    // Type text
    const typeText = async () => {
      const element = await document.querySelector("${node.data.settings?.selector || ''}");
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.value = "${node.data.settings?.text || ''}";
        element.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        throw new Error("Element is not input or textarea: ${node.data.settings?.selector || ''}");
      }
    };
    await typeText();`;

    case 'page-scroll':
      return `
    // Scroll page
    ${node.data.settings?.selector ? 
      `const scrollToElement = async () => {
        const element = document.querySelector("${node.data.settings?.selector}");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          throw new Error("Scroll target not found: ${node.data.settings?.selector}");
        }
      };
      await scrollToElement();` 
      : 
      `window.scrollTo({
        top: ${node.data.settings?.scrollY || 0},
        behavior: "smooth"
      });`
    }`;

    default:
      return '';
  }
};
