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

const createNodeTypeMapping = () => {
  const mapping: Record<string, string> = {};
  
  nodeCategories.forEach(category => {
    category.nodes.forEach(node => {
      mapping[node.type] = node.type;
      mapping[node.label.toLowerCase()] = node.type;
    });
  });

  return mapping;
};

const nodeTypeMapping = createNodeTypeMapping();

const getNodeType = (jsonType: string, label: string): string => {
  console.log('Trying to map node:', { jsonType, label });

  const specialCases: Record<string, string> = {
    'click': 'page-click',
    'input': 'page-type',
    'wait': 'page-wait',
    'focus': 'page-focus',
    'hover': 'page-hover',
    'keyboard': 'page-keyboard',
    'scroll': 'page-scroll',
    'select': 'page-select',
    'waitFor': 'page-wait-for'
  };

  if (nodeTypeMapping[jsonType]) {
    return nodeTypeMapping[jsonType];
  }

  if (specialCases[jsonType.toLowerCase()]) {
    return specialCases[jsonType.toLowerCase()];
  }

  if (nodeTypeMapping[label.toLowerCase()]) {
    return nodeTypeMapping[label.toLowerCase()];
  }

  console.warn(`No matching node type found for: ${jsonType} with label: ${label}, using default`);
  return 'default';
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
        type: nodeType,
        label: node.label,
        settings: node.data as NodeSettings,
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

export const generatePuppeteerScript = (workflow: WorkflowJson): string => {
  let script = `// Generated Puppeteer script\n\n`;

  workflow.drawflow.nodes.forEach((node) => {
    const nodeType = getNodeType(node.type, node.label);
    console.log(`Processing node for script: ${node.label} -> ${nodeType}`);

    switch (nodeType) {
      case 'page-click':
        script += `await page.waitForSelector('${node.data.selector}');\n`;
        script += `await page.click('${node.data.selector}', ${JSON.stringify(node.data.settings || {})});\n`;
        break;

      case 'page-type':
        script += `await page.waitForSelector('${node.data.selector}');\n`;
        script += `await page.type('${node.data.selector}', '${node.data.value || ''}', { delay: ${node.data.delay || 0} });\n`;
        break;

      case 'page-wait-for':
        script += `await page.waitForSelector('${node.data.selector}', ${JSON.stringify(node.data.settings || {})});\n`;
        break;

      case 'page-focus':
        script += `await page.waitForSelector('${node.data.selector}');\n`;
        script += `await page.focus('${node.data.selector}');\n`;
        break;

      case 'page-hover':
        script += `await page.waitForSelector('${node.data.selector}');\n`;
        script += `await page.hover('${node.data.selector}');\n`;
        break;

      case 'page-keyboard':
        if (node.data.text) {
          script += `await page.keyboard.type('${node.data.text}', { delay: ${node.data.delay || 0} });\n`;
        } else if (node.data.key) {
          script += `await page.keyboard.press('${node.data.key}');\n`;
        }
        break;

      case 'page-select':
        script += `await page.waitForSelector('${node.data.selector}');\n`;
        script += `await page.select('${node.data.selector}', '${node.data.value}');\n`;
        break;

      case 'page-scroll':
        if (node.data.selector) {
          script += `await page.waitForSelector('${node.data.selector}');\n`;
          script += `await page.$eval('${node.data.selector}', (element) => element.scrollIntoView({ behavior: '${node.data.behavior || 'smooth'}' }));\n`;
        } else {
          script += `await page.evaluate(() => window.scrollBy(${node.data.scrollX || 0}, ${node.data.scrollY || 0}));\n`;
        }
        break;

      case 'page-wait':
        script += `await page.waitForTimeout(${node.data.timeout || 1000});\n`;
        break;

      default:
        script += `// Unsupported node type: ${nodeType} (${node.label})\n`;
        break;
    }
  });

  return script;
};
