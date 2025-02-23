
import { FlowNode } from '@/types/flow';

export const mathNodes: FlowNode[] = [
  {
    type: "math-add",
    label: "Add Numbers",
    description: "Adds two numbers (a + b)",
    color: "#22C55E",
    icon: "Plus",
    settings: {
      a: 0,
      b: 0
    },
    outputs: [
      {
        id: "result",
        label: "Result"
      }
    ]
  },
  {
    type: "math-subtract",
    label: "Subtract Numbers",
    description: "Subtracts two numbers (a - b)",
    color: "#22C55E",
    icon: "Minus",
    settings: {
      a: 0,
      b: 0
    },
    outputs: [
      {
        id: "result",
        label: "Result"
      }
    ]
  },
  {
    type: "math-multiply",
    label: "Multiply Numbers",
    description: "Multiplies two numbers (a * b)",
    color: "#22C55E",
    icon: "Asterisk",
    settings: {
      a: 0,
      b: 0
    },
    outputs: [
      {
        id: "result",
        label: "Result"
      }
    ]
  },
  {
    type: "math-divide",
    label: "Divide Numbers",
    description: "Divides two numbers (a / b)",
    color: "#22C55E",
    icon: "Divide",
    settings: {
      a: 0,
      b: 0
    },
    outputs: [
      {
        id: "result",
        label: "Result"
      }
    ]
  },
  {
    type: "math-random",
    label: "Random Number",
    description: "Generates a random number between 0 and max",
    color: "#22C55E",
    icon: "Shuffle",
    settings: {
      max: 10
    },
    outputs: [
      {
        id: "result",
        label: "Result"
      }
    ]
  }
];
