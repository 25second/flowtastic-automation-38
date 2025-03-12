
import { FlowNode } from '@/types/flow';
import { Chrome, Bot, BrainCircuit } from 'lucide-react';

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
  },
  {
    type: 'ai-assistant',
    label: 'AI Assistant',
    description: 'Interact with an AI assistant',
    color: '#8B5CF6',
    icon: BrainCircuit,
    settings: {
      prompt: '',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      selectedOutputs: ['response']
    },
    outputs: [
      { id: "response", label: "Response" },
      { id: "tokens", label: "Tokens" }
    ],
    showFlowPoints: true
  }
];
