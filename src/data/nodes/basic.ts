
import { FlowNode } from '@/types/flow';

export const basicNodes: FlowNode[] = [
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
  }
];
