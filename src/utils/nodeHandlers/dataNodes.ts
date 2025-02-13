
import { FlowNodeWithData } from '@/types/flow';

export const handleDataNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'data-extract':
      return `
    // Extract data
    const elements = document.querySelectorAll("${node.data.settings?.selector || ''}");
    if (elements.length === 0) {
      throw new Error('No elements found: ${node.data.settings?.selector}');
    }
    const extractedData = Array.from(elements).map(el => 
      "${node.data.settings?.attribute || 'text'}" === 'text' ? 
        el.textContent : 
        el.getAttribute("${node.data.settings?.attribute || ''}")
    );
    console.log('Extracted data:', extractedData);`;

    case 'data-save':
      return `
    // Save data to file
    const saveData = ${JSON.stringify(node.data.settings?.data || {})};
    const blob = new Blob([JSON.stringify(saveData)], { 
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "${node.data.settings?.filename || 'data'}.${node.data.settings?.format || 'json'}";
    a.click();
    URL.revokeObjectURL(url);
    console.log('Data saved to file');`;

    default:
      return '';
  }
};
