
interface WorkflowNode {
  label: string;
  data: {
    url?: string;
    selector?: string;
    value?: string;
    keys?: string;
    scrollX?: number;
    scrollY?: number;
  };
}

interface WorkflowJson {
  drawflow: {
    nodes: WorkflowNode[];
  };
}

export const generatePuppeteerScript = (workflow: WorkflowJson): string => {
  let script = `// Сгенерированный Puppeteer-скрипт\n\n`;

  // Обработка нод
  workflow.drawflow.nodes.forEach((node) => {
    switch (node.label) {
      case 'new-tab':
        script += `await page.goto('${node.data.url}');\n`;
        break;

      case 'forms':
        script += `await page.waitForSelector('${node.data.selector}');\n`;
        script += `await page.type('${node.data.selector}', '${node.data.value}');\n`;
        break;

      case 'press-key':
        script += `await page.keyboard.press('${node.data.keys}');\n`;
        break;

      case 'event-click':
        script += `await page.waitForSelector('${node.data.selector}');\n`;
        script += `await page.click('${node.data.selector}');\n`;
        break;

      case 'element-scroll':
        script += `await page.evaluate(() => {\n`;
        script += `  window.scrollBy(${node.data.scrollX}, ${node.data.scrollY});\n`;
        script += `});\n`;
        break;

      default:
        script += `// Неподдерживаемый тип ноды: ${node.label}\n`;
        break;
    }
  });

  return script;
};
