
import { FlowNode } from '@/types/flow';

export const dataGenerationNodes: FlowNode[] = [
  {
    type: "generate-person",
    label: "Generate Person",
    description: "Generates complete person data with multiple output points",
    color: "#6366F1",
    icon: "UserRound",
    settings: {
      gender: "",
      nationality: "",
      country: "",
      emailDomain: ""
    }
  }
];
