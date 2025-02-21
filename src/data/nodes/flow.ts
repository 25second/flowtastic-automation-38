
import { FlowNode } from '@/types/flow';

export const flowNodes: FlowNode[] = [
  {
    type: "wait",
    label: "Wait",
    description: "Waits for a specified time or element",
    color: "#F59E0B",
    icon: "Timer",
    settings: {
      mode: "delay",
      value: 1000,
      selector: ""
    }
  },
  {
    type: "condition",
    label: "If Condition",
    description: "Controls flow based on a condition",
    color: "#10B981",
    icon: "GitBranch",
    settings: {
      condition: ""
    }
  }
];
