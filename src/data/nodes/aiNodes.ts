
import { FlowNode } from '@/types/flow';
import { Brain, Browser } from 'lucide-react';

export const aiNodes: FlowNode[] = [
  {
    type: 'ai-action',
    label: 'AI Action',
    description: 'Execute actions using natural language',
    color: '#6366F1',
    icon: Brain,
    settings: {
      useSettingsPort: false,
      action: '',
      description: 'Describe what you want to do in natural language',
      selectedOutputs: ['result']
    },
    outputs: [
      { id: "result", label: "Result" }
    ],
    showFlowPoints: true
  },
  {
    type: 'ai-browser-action',
    label: 'AI Browser Action',
    description: 'Execute browser actions using natural language',
    color: '#6366F1',
    icon: Browser,
    settings: {
      useSettingsPort: false,
      action: '',
      description: 'Describe what browser action to perform (e.g. "Click the Sign Up button")',
      selectedOutputs: ['result']
    },
    outputs: [
      { id: "result", label: "Result" }
    ],
    showFlowPoints: true
  }
];
