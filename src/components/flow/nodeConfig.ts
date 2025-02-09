
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

export const nodeCategories: NodeCategory[] = [
  {
    name: 'Browser Actions',
    nodes: [
      { 
        type: 'browser-goto', 
        label: 'Go to URL', 
        description: 'Navigate to a specific URL', 
        settings: { url: '', timeout: 5000 },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
      { 
        type: 'browser-click', 
        label: 'Click Element', 
        description: 'Click on a page element', 
        settings: { selector: '', timeout: 5000 },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
      { 
        type: 'browser-input', 
        label: 'Fill Input', 
        description: 'Enter text into an input field', 
        settings: { selector: '', value: '', timeout: 5000 },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
    ]
  },
  {
    name: 'Data',
    nodes: [
      { 
        type: 'data-extract', 
        label: 'Extract Data', 
        description: 'Extract data from webpage', 
        settings: { selector: '', attribute: 'text' },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
      { 
        type: 'data-save', 
        label: 'Save Data', 
        description: 'Save extracted data', 
        settings: { filename: '', format: 'json' },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
    ]
  },
  {
    name: 'Flow Control',
    nodes: [
      { 
        type: 'flow-if', 
        label: 'If Condition', 
        description: 'Conditional branching', 
        settings: { condition: '' },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
      { 
        type: 'flow-loop', 
        label: 'Loop', 
        description: 'Repeat actions', 
        settings: { times: 1 },
        style: { background: '#fff', padding: '15px', borderRadius: '8px', width: 180 }
      },
    ]
  }
];

