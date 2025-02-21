
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

// Create mapping based on existing nodes
const createNodeTypeMapping = () => {
  const mapping: Record<string, string> = {};
  
  nodeCategories.forEach(category => {
    category.nodes.forEach(node => {
      // Map by type
      mapping[node.type] = node.type;
      // Also map by label (lowercase for easier comparison)
      mapping[node.label.toLowerCase()] = node.type;
    });
  });

  return mapping;
};

const nodeTypeMapping = createNodeTypeMapping();

const getNodeType = (jsonType: string, label: string): string => {
  // Log available node types for debugging
  console.log('Available node types:', Object.keys(nodeTypeMapping));
  console.log('Trying to map node:', { jsonType, label });

  // Check exact type match
  if (nodeTypeMapping[jsonType]) {
    console.log(`Found exact type match: ${nodeTypeMapping[jsonType]}`);
    return nodeTypeMapping[jsonType];
  }

  // Check label match (case insensitive)
  const labelMatch = nodeTypeMapping[label.toLowerCase()];
  if (labelMatch) {
    console.log(`Found label match: ${labelMatch}`);
    return labelMatch;
  }

  // Special case mappings (common conversions)
  const specialCases: Record<string, string> = {
    'new-tab': 'open-page',
    'forms': 'input-text',
    'press-key': 'input-text',
    'event-click': 'click',
    'element-scroll': 'page-scroll',
    'click': 'page-click',
    'input': 'page-type',
    'wait': 'flow-wait',
    'condition': 'flow-if',
    'extract': 'data-extract',
    'navigate': 'open-page'
  };

  if (specialCases[label.toLowerCase()]) {
    console.log(`Found special case match: ${specialCases[label.toLowerCase()]}`);
    return specialCases[label.toLowerCase()];
  }

  // If no match found, use default from our catalog
  console.warn(`No matching node type found for: ${jsonType} with label: ${label}, using default`);
  return 'default';
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
      case 'page-type':
        if (node.data.selector) {
          script += `await page.waitForSelector('${node.data.selector}');\n`;
          script += `await page.type('${node.data.selector}', '${node.data.value || ''}');\n`;
        }
        break;

      case 'click':
      case 'page-click':
        if (node.data.selector) {
          script += `await page.waitForSelector('${node.data.selector}');\n`;
          script += `await page.click('${node.data.selector}');\n`;
        }
        break;

      case 'flow-wait':
      case 'wait':
        script += `await page.waitForTimeout(${node.data.value || 1000});\n`;
        break;

      case 'data-extract':
      case 'extract':
        if (node.data.selector) {
          script += `const extractedData = await page.$eval('${node.data.selector}', el => el.textContent);\n`;
          script += `console.log('Extracted:', extractedData);\n`;
        }
        break;

      case 'flow-if':
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
