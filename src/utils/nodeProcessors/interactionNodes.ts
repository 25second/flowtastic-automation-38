
import { FlowNodeWithData } from '@/types/flow';

export const processClickNode = (node: FlowNodeWithData, connections: any[] = []) => {
  const settings = node.data.settings || {};
  
  // Проверяем, есть ли входящее соединение для селектора
  const selectorConnection = connections.find(conn => conn.targetHandle === 'setting-selector');
  const selector = selectorConnection 
    ? `global.getNodeOutput('${selectorConnection.sourceNode.id}', '${selectorConnection.sourceHandle}')`
    : `'${settings.selector}'`;

  return `
    if (!global.page) {
      global.page = await global.browser.newPage();
    }
    const selector = ${selector};
    await global.page.waitForSelector(selector);
    await global.page.click(selector);`;
};

export const processInputNode = (node: FlowNodeWithData, connections: any[] = []) => {
  const settings = node.data.settings || {};
  let text = settings.text || '';

  // Check if text should come from a connection
  const textConnection = connections.find(conn => conn.targetHandle === 'setting-text');
  if (textConnection) {
    if (textConnection.sourceNode.type === 'read-table') {
      text = `global.getNodeOutput('${textConnection.sourceNode.id}', 'value')`;
    } else {
      text = `global.getNodeOutput('${textConnection.sourceNode.id}', '${textConnection.sourceHandle}')`;
    }
  } else {
    text = `"${text}"`;
  }

  return `
    // Type text into input
    const textToInput = ${text};
    console.log('Inputting text:', textToInput);
    
    if (!global.page) {
      global.page = await global.browser.newPage();
    }
    
    const element = await global.page.waitForSelector('${settings.selector}');
    
    ${settings.clearBefore ? `await element.click({ clickCount: 3 });` : ''}
    await element.type(textToInput, { delay: ${settings.delay || 0} });`;
};
