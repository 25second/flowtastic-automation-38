
import { FlowNodeWithData } from '@/types/flow';

export const handleDataNode = (node: FlowNodeWithData) => {
  switch (node.type) {
    case 'data-extract':
      return `
    // Extract data from elements
    const extractData = () => {
      const elements = document.querySelectorAll("${node.data.settings?.selector || ''}");
      if (elements.length === 0) {
        throw new Error('No elements found matching selector: ${node.data.settings?.selector || ''}');
      }
      return Array.from(elements).map(element => {
        if ("${node.data.settings?.dataType}" === 'text') {
          return element.textContent;
        } else if ("${node.data.settings?.dataType}" === 'html') {
          return element.innerHTML;
        } else if ("${node.data.settings?.dataType}" === 'attribute') {
          return element.getAttribute("${node.data.settings?.attribute || ''}");
        }
        return null;
      }).filter(Boolean);
    };
    const extractedData = extractData();`;

    case 'data-save':
      return `
    // Save data to file
    const saveData = () => {
      const data = ${JSON.stringify(node.data.settings?.data || {})};
      const blob = new Blob(
        ["${node.data.settings?.format}" === 'json' ? 
          [JSON.stringify(data)] : 
          [data.toString()]
        ], 
        { type: "${node.data.settings?.format}" === 'json' ? 'application/json' : 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "${node.data.settings?.filename || 'data'}.${node.data.settings?.format || 'json'}";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    await saveData();`;

    default:
      return '';
  }
};
