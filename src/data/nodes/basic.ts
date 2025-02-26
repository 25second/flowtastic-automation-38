
import { FlowNode } from '@/types/flow';
import { Play, StopCircle, StickyNote } from 'lucide-react';

export const basicNodes: FlowNode[] = [
  {
    type: "start-script",
    label: "Start Script",
    description: "Starting point for script execution",
    color: "#3B82F6",
    icon: Play,
    settings: {
      outputs: [
        { id: "flow", label: "" }
      ]
    },
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
    type: "noteNode",
    label: "Add Note",
    description: "Add a note to your workflow",
    color: "#FCD34D",
    icon: StickyNote,
    settings: {
      content: "",
      color: "bg-yellow-100"
    }
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
