
import { FlowNode } from '@/types/flow';

export const linkenSphereNodes: FlowNode[] = [
  {
    type: "session-stop",
    label: "Stop Session",
    description: "Stop the current Linken Sphere session",
    color: "#FDE1D3",
    icon: "StopCircle",
    isTerminal: true,
    settings: {
      useSettingsPort: true
    }
  }
];
