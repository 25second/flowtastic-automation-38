
import { FlowNodeWithData } from '@/types/flow';

export const handlePageNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'page-click':
      return `
    // Click element
    const clickElement = document.querySelector("${node.data.settings?.selector || ''}");
    if (clickElement) {
      clickElement.click();
      console.log('Clicked element:', "${node.data.settings?.selector}");
    } else {
      throw new Error('Element not found: ${node.data.settings?.selector}');
    }`;

    case 'page-type':
      return `
    // Type text
    const typeElement = document.querySelector("${node.data.settings?.selector || ''}");
    if (typeElement) {
      typeElement.value = "${node.data.settings?.text || ''}";
      typeElement.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('Typed text into:', "${node.data.settings?.selector}");
    } else {
      throw new Error('Element not found: ${node.data.settings?.selector}');
    }`;

    case 'page-scroll':
      return `
    // Scroll page
    const scrollElement = "${node.data.settings?.selector}" ? 
      document.querySelector("${node.data.settings?.selector}") : 
      document.documentElement;
    if (scrollElement) {
      scrollElement.scrollIntoView({ 
        behavior: "${node.data.settings?.behavior || 'smooth'}"
      });
      console.log('Scrolled to:', "${node.data.settings?.selector || 'top'}");
    } else {
      throw new Error('Scroll target not found');
    }`;

    default:
      return '';
  }
};
