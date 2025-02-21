
import { FlowNode } from '@/types/flow';

export const basicNodes: FlowNode[] = [
  {
    type: "start",
    label: "Start Node",
    description: "Starting point of the workflow",
    color: "#22C55E",
    icon: "Play",
    settings: {}
  },
  {
    type: "end",
    label: "End Node",
    description: "Ends the workflow execution",
    color: "#EF4444",
    icon: "StopCircle",
    settings: {}
  }
];
