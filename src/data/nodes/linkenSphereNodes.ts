
import { FlowNode } from '@/types/flow';

export const linkenSphereNodes: FlowNode[] = [
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
