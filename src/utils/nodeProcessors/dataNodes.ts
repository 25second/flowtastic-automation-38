
import { FlowNodeWithData } from '@/types/flow';

export const processExtractNode = (node: FlowNodeWithData) => {
  const selector = node.data.settings?.selector || '';
  const dataType = node.data.settings?.dataType || 'text';
  const attribute = node.data.settings?.attribute || '';
  return `
    // Extract data
    console.log('Extracting data from:', "${selector}");
    const extractedData = await global.page.evaluate((selector, dataType, attribute) => {
      const elements = document.querySelectorAll(selector);
      return Array.from(elements).map(el => {
        if (dataType === 'text') return el.textContent;
        if (dataType === 'html') return el.innerHTML;
        if (dataType === 'attribute') return el.getAttribute(attribute);
        return null;
      });
    }, "${selector}", "${dataType}", "${attribute}");
    console.log('Extracted data:', extractedData);
    global.extractedData = extractedData;`;
};

export const processSaveDataNode = (node: FlowNodeWithData) => {
  const format = node.data.settings?.format || 'json';
  return `
    // Save extracted data
    console.log('Saving data...');
    if (global.extractedData) {
      const dataStr = ${format === 'json' ? 'JSON.stringify(global.extractedData, null, 2)' : 'global.extractedData.join("\\n")'};
      await global.page.evaluate((dataStr) => {
        const blob = new Blob([dataStr], { type: 'text/${format === 'json' ? 'json' : 'plain'}' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted-data.${format}';
        a.click();
        URL.revokeObjectURL(url);
      }, dataStr);
    }`;
};
