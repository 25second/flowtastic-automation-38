
import { FlowNode } from '@/types/flow';
import { Chrome, Bot } from 'lucide-react';

export const aiNodes: FlowNode[] = [
  {
    type: 'ai-browser-action',
    label: 'AI Browser Action',
    description: 'Execute browser actions using natural language',
    color: '#6366F1',
    icon: Chrome,
    settings: {
      action: '',
      selectedOutputs: ['result']
    },
    outputs: [
      { id: "result", label: "Result" }
    ],
    showFlowPoints: true
  },
  {
    type: 'ai-agent',
    label: 'AI Agent',
    description: 'Execute a predefined AI agent',
    color: '#9b87f5',
    icon: Bot,
    settings: {
      agentId: '',
      description: '',
      taskDescription: ''
    },
    outputs: [
      { id: "result", label: "Result" }
    ],
    showFlowPoints: true
  }
];
