
import { FlowNode } from '@/types/flow';

export const codeNodes: FlowNode[] = [
  {
    type: "run-script",
    label: "Run JavaScript",
    description: "Executes custom JavaScript code",
    color: "#F59E0B",
    icon: "Code",
    settings: {
      code: ""
    }
  }
];
