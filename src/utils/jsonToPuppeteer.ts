
import { Edge } from '@xyflow/react';
import { FlowNodeWithData, NodeSettings } from '@/types/flow';

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

// Маппинг типов нод из JSON в типы React Flow
const nodeTypeMapping: Record<string, string> = {
  'new-tab': 'tab-new',
  'forms': 'page-type',
  'press-key': 'page-type',
  'event-click': 'page-click',
  'element-scroll': 'page-scroll',
  'BlockBasic': 'default',
  // Добавьте другие маппинги по мере необходимости
};

const getNodeType = (jsonType: string, label: string): string => {
  // Сначала проверяем по метке, так как она часто более точно определяет тип
  const typeByLabel = nodeTypeMapping[label];
  if (typeByLabel) {
    return typeByLabel;
  }

  // Если по метке не нашли, проверяем по типу
  const typeByType = nodeTypeMapping[jsonType];
  if (typeByType) {
    return typeByType;
  }

  // Если ни один маппинг не сработал, возвращаем default
  console.warn(`Unknown node type: ${jsonType} with label: ${label}, using default`);
  return 'default';
};

export const generatePuppeteerScript = (workflow: WorkflowJson): string => {
  let script = `// Сгенерированный Puppeteer-скрипт\n\n`;

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

const convertToNodeSettings = (data: WorkflowNode['data']): NodeSettings => {
  const settings: NodeSettings = {};

  // Convert all values to their appropriate types
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'value' && typeof value === 'string') {
      // Convert string value to number if possible, or use 0 as default
      settings[key] = Number(value) || 0;
    } else if (key === 'scrollX' || key === 'scrollY') {
      settings[key] = typeof value === 'number' ? value : 0;
    } else {
      settings[key] = value;
    }
  });

  return settings;
};

export const processWorkflowJson = (workflow: WorkflowJson): ConversionResult => {
  const nodes: FlowNodeWithData[] = [];
  const edges: Edge[] = [];
  
  workflow.drawflow.nodes.forEach((node, index) => {
    // Определяем правильный тип ноды
    const nodeType = getNodeType(node.type, node.label);
    console.log(`Processing node: ${node.label}, type: ${node.type} -> ${nodeType}`);

    const newNode: FlowNodeWithData = {
      id: node.id || `node-${index}`,
      type: nodeType,
      position: node.position || { x: index * 200, y: 100 },
      data: {
        label: node.label,
        settings: convertToNodeSettings(node.data),
        description: node.data.description || ''
      }
    };
    nodes.push(newNode);
    
    if (index > 0) {
      const edge: Edge = {
        id: `edge-${index}`,
        source: nodes[index - 1].id,
        target: newNode.id,
        type: 'smoothstep',
      };
      edges.push(edge);
    }
  });

  return { nodes, edges };
};
