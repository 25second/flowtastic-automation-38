
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
    type: "start-script",
    label: "Start Script",
    description: "Starting point for script execution",
    color: "#3B82F6",
    icon: "PlayCircle",
    settings: {},
    isTerminal: true
  },
  {
    type: "stop",
    label: "Stop",
    description: "Stops the workflow execution",
    color: "#DC2626",
    icon: "StopCircle",
    settings: {},
    isTerminal: true
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
