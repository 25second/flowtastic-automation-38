import { Edge } from '@xyflow/react';
import { FlowNodeWithData, NodeSettings } from '@/types/flow';
import { nodeCategories } from '@/data/nodes';

interface WorkflowNode {
  id: string;
  label: string;
  type: string;
  data: {
    url?: string;
    selector?: string;
    value?: string | number;
    keys?: string;
    scrollX?: number;
    scrollY?: number;
    [key: string]: any;
  };
  position: {
    x: number;
    y: number;
  };
}

interface WorkflowJson {
  drawflow: {
    nodes: WorkflowNode[];
  };
}

interface ConversionResult {
  nodes: FlowNodeWithData[];
  edges: Edge[];
}

// Создаем каталог всех доступных нод и их настроек
const createNodeCatalog = () => {
  const catalog: Record<string, { type: string; settings: Record<string, any> }> = {};
  
  nodeCategories.forEach(category => {
    category.nodes.forEach(node => {
      catalog[node.type] = {
        type: node.type,
        settings: node.settings
      };
    });
  });
  
  return catalog;
};

const nodeCatalog = createNodeCatalog();

const findMatchingNodeType = (jsonType: string, label: string): string | null => {
  // Проверяем прямое совпадение типа
  if (nodeCatalog[jsonType]) {
    return jsonType;
  }

  // Проверяем базовые маппинги
  const basicMappings: Record<string, string> = {
    'click': 'page-click',
    'type': 'page-type',
    'wait': 'page-wait',
    'focus': 'page-focus',
    'hover': 'page-hover',
    'keyboard': 'page-keyboard',
    'scroll': 'page-scroll',
    'select': 'page-select',
  };

  const mappedType = basicMappings[jsonType.toLowerCase()];
  if (mappedType && nodeCatalog[mappedType]) {
    return mappedType;
  }

  return null;
};

// Фильтруем настройки, оставляя только те, которые определены в каталоге нод
const filterNodeSettings = (settings: Record<string, any>, nodeType: string): NodeSettings => {
  const filteredSettings: NodeSettings = {};
  const allowedSettings = nodeCatalog[nodeType]?.settings || {};

  Object.entries(settings).forEach(([key, value]) => {
    if (key in allowedSettings) {
      filteredSettings[key as keyof NodeSettings] = value;
    }
  });

  return filteredSettings;
};

export const generatePuppeteerScript = (workflow: WorkflowJson): string => {
  let script = `// Generated Puppeteer script\n\n`;

  workflow.drawflow.nodes.forEach((node) => {
    const nodeType = findMatchingNodeType(node.type, node.label);
    if (!nodeType) {
      console.warn(`Skipping unsupported node: ${node.label} (${node.type})`);
      return;
    }

    const settings = filterNodeSettings(node.data, nodeType);
    console.log(`Processing node: ${node.label} -> ${nodeType}`, settings);

    switch (nodeType) {
      case 'page-click':
        if (settings.selector) {
          script += `await page.waitForSelector('${settings.selector}');\n`;
          script += `await page.click('${settings.selector}', { 
            delay: ${settings.delay || 0},
            button: '${settings.button || 'left'}',
            clickCount: ${settings.clickCount || 1}
          });\n`;
        }
        break;

      case 'page-type':
        if (settings.selector && settings.text) {
          script += `await page.waitForSelector('${settings.selector}');\n`;
          script += `await page.type('${settings.selector}', '${settings.text}', { delay: ${settings.delay || 0} });\n`;
        }
        break;

      case 'page-wait-for':
        if (settings.selector) {
          script += `await page.waitForSelector('${settings.selector}', {
            visible: ${settings.visible || true},
            hidden: ${settings.hidden || false},
            timeout: ${settings.timeout || 30000}
          });\n`;
        }
        break;

      case 'page-focus':
        if (settings.selector) {
          script += `await page.waitForSelector('${settings.selector}');\n`;
          script += `await page.focus('${settings.selector}');\n`;
        }
        break;

      case 'page-hover':
        if (settings.selector) {
          script += `await page.waitForSelector('${settings.selector}');\n`;
          script += `await page.hover('${settings.selector}');\n`;
        }
        break;

      case 'page-keyboard':
        if (settings.key) {
          script += `await page.keyboard.press('${settings.key}');\n`;
        } else if (settings.text) {
          script += `await page.keyboard.type('${settings.text}', { delay: ${settings.delay || 0} });\n`;
        }
        break;

      case 'page-select':
        if (settings.selector && settings.value) {
          script += `await page.waitForSelector('${settings.selector}');\n`;
          script += `await page.select('${settings.selector}', '${settings.value}');\n`;
        }
        break;

      case 'page-scroll':
        if (settings.selector) {
          script += `await page.waitForSelector('${settings.selector}');\n`;
          script += `await page.$eval('${settings.selector}', (element) => element.scrollIntoView({ behavior: '${settings.behavior || 'smooth'}' }));\n`;
        } else {
          script += `await page.evaluate(() => window.scrollBy(${settings.scrollX || 0}, ${settings.scrollY || 0}));\n`;
        }
        break;

      case 'page-wait':
        script += `await page.waitForTimeout(${settings.timeout || 1000});\n`;
        break;
    }
  });

  return script;
};

export const processWorkflowJson = (workflow: WorkflowJson): ConversionResult => {
  const nodes: FlowNodeWithData[] = [];
  const edges: Edge[] = [];
  
  workflow.drawflow.nodes.forEach((node, index) => {
    const nodeType = findMatchingNodeType(node.type, node.label);
    if (!nodeType) {
      console.warn(`Skipping unsupported node during conversion: ${node.label} (${node.type})`);
      return;
    }

    const settings = filterNodeSettings(node.data, nodeType);
    console.log(`Converting node: ${node.label} -> ${nodeType}`, settings);

    const newNode: FlowNodeWithData = {
      id: node.id || `node-${index}`,
      type: nodeType,
      position: node.position || { x: index * 200, y: 100 },
      data: {
        label: node.label,
        settings,
        description: node.data.description || ''
      }
    };
    nodes.push(newNode);
    
    // Создаем связи только между поддерживаемыми нодами
    if (nodes.length > 1) {
      const edge: Edge = {
        id: `edge-${nodes.length}`,
        source: nodes[nodes.length - 2].id,
        target: newNode.id,
        type: 'smoothstep',
      };
      edges.push(edge);
    }
  });

  return { nodes, edges };
};
