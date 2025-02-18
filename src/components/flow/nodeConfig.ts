
import nodesData from '@/data/nodes.json';
import { NodeCategory, FlowNode } from '@/types/flow';

export const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: 'Start',
      settings: {
        description: '',
        timeout: 5000,
        retries: 3
      }
    },
    position: { x: 250, y: 25 },
    style: {
      background: '#fff',
      padding: '15px',
      borderRadius: '8px',
      width: 180,
    },
  },
];

// Add common style to all nodes
const nodeStyle = {
  background: '#fff',
  padding: '15px',
  borderRadius: '8px',
  width: 180,
};

// Process the JSON data and add common styles
export const nodeCategories: NodeCategory[] = nodesData.categories.map(category => ({
  name: category.name,
  nodes: category.nodes.map(node => ({
    ...node,
    style: nodeStyle
  }))
}));
