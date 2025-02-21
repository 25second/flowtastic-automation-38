
import { FlowNode } from '@/types/flow';

export const interactionNodes: FlowNode[] = [
  {
    type: "click",
    label: "Click Element",
    description: "Clicks on a specified element",
    color: "#F97316",
    icon: "MousePointer",
    settings: {
      selector: "",
      clickType: "single",
      delay: 0
    }
  },
  {
    type: "input-text",
    label: "Input Text",
    description: "Types text into an input field",
    color: "#06B6D4",
    icon: "Type",
    settings: {
      selector: "",
      text: "",
      clearBefore: true,
      delay: 0
    }
  }
];
