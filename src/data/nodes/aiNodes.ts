
import { FlowNode } from '@/types/flow';
import { Brain } from 'lucide-react';

export const aiNodes: FlowNode[] = [
  {
    type: 'ai-action',
    label: 'AI Action',
    description: 'Execute actions using natural language',
    color: '#F59E0B',
    icon: Brain,
    settings: {
      useSettingsPort: false,
      inputs: [
        { id: "flow", label: "Flow" }
      ],
      outputs: [
        { id: "flow", label: "Flow" }
      ],
      action: '',
      description: 'Describe what you want to do in natural language'
    },
    showFlowPoints: true
  }
];
