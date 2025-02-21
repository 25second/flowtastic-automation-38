
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

// Создаем маппинг на основе существующих нод
const createNodeTypeMapping = () => {
  const mapping: Record<string, string> = {};
  
  nodeCategories.forEach(category => {
    category.nodes.forEach(node => {
      // Маппим по типу ноды
      mapping[node.type] = node.type;
      // Также маппим по метке (в нижнем регистре для удобства сравнения)
      mapping[node.label.toLowerCase()] = node.type;
    });
  });

  return mapping;
};

const nodeTypeMapping = createNodeTypeMapping();

const getNodeType = (jsonType: string, label: string): string => {
  // Проверяем точное совпадение типа
  if (nodeTypeMapping[jsonType]) {
    return nodeTypeMapping[jsonType];
  }

  // Проверяем метку в нижнем регистре
  const labelMatch = nodeTypeMapping[label.toLowerCase()];
  if (labelMatch) {
    return labelMatch;
  }

  // Специальные случаи маппинга
  switch (label) {
    case 'new-tab':
      return 'open-page';
    case 'forms':
      return 'input-text';
    case 'press-key':
      return 'input-text';
    case 'event-click':
      return 'click';
    case 'element-scroll':
      return 'page-scroll';
    default:
      // Если не нашли соответствие, логируем и возвращаем default
      console.warn(`Unknown node type: ${jsonType} with label: ${label}, using default`);
      return 'default';
  }
};

export const generatePuppeteerScript = (workflow: WorkflowJson): string => {
  let script = `// Generated Puppeteer script\n\n`;

  workflow.drawflow.nodes.forEach((node) => {
    const nodeType = getNodeType(node.type, node.label);
    console.log(`Processing node for script: ${node.label} -> ${nodeType}`);

    switch (nodeType) {
      case 'open-page':
        script += `await page.goto('${node.data.url}');\n`;
        break;

      case 'input-text':
        if (node.data.selector) {
          script += `await page.waitForSelector('${node.data.selector}');\n`;
          script += `await page.type('${node.data.selector}', '${node.data.value || ''}');\n`;
        }
        break;

      case 'click':
        if (node.data.selector) {
          script += `await page.waitForSelector('${node.data.selector}');\n`;
          script += `await page.click('${node.data.selector}');\n`;
        }
        break;

      case 'wait':
        script += `await page.waitForTimeout(${node.data.value || 1000});\n`;
        break;

      case 'extract':
        if (node.data.selector) {
          script += `const extractedData = await page.$eval('${node.data.selector}', el => el.textContent);\n`;
          script += `console.log('Extracted:', extractedData);\n`;
        }
        break;

      case 'condition':
        if (node.data.condition) {
          script += `if (${node.data.condition}) {\n  // Condition block\n}\n`;
        }
        break;

      default:
        script += `// Unsupported node type: ${nodeType} (${node.label})\n`;
        break;
    }
  });

  return script;
};

const convertToNodeSettings = (data: WorkflowNode['data']): NodeSettings => {
  const settings: NodeSettings = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'value' && typeof value === 'string') {
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
