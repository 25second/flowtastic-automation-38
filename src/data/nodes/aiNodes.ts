
import { FlowNode } from '@/types/flow';
import { Brain } from 'lucide-react';

export const aiNodes: FlowNode[] = [
  {
    type: 'ai-action',
    label: 'AI Action',
    description: 'Execute actions using natural language',
    color: '#FF6B6B',
    icon: Brain,
    settings: {
      action: '',
      description: 'Describe what you want to do in natural language'
    }
  }
];
