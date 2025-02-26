
import { FlowNode } from '@/types/flow';
import { Play, StopCircle } from 'lucide-react';

export const basicNodes: FlowNode[] = [
  {
    type: "start-script",
    label: "Start Script",
    description: "Starting point for script execution",
    color: "#3B82F6",
    icon: Play,
    settings: {},
    isTerminal: true
  },
  {
    type: "stop",
    label: "Stop",
    description: "Stops the workflow execution",
    color: "#DC2626",
    icon: StopCircle,
    settings: {},
    isTerminal: true
  },
  {
    type: "linken-sphere-stop-session",
    label: "Stop Session",
    description: "Stops the current Linken Sphere session",
    color: "#F43F5E",
    icon: "StopCircle",
    settings: {
      useSettingsPort: true,
      inputs: [
        { id: "input", label: "" }
      ],
      outputs: []
    }
  }
];
