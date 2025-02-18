
import { FlowNode } from '@/types/flow';
import { defaultStyle } from './styles';

export const javascriptNodes: FlowNode[] = [
  {
    type: "js-execute",
    label: "Execute Script",
    description: "Executes JavaScript code in the browser",
    color: "#DB2777",
    icon: "Play",
    settings: {
      code: "console.log('Hello, world!');",
    },
    style: defaultStyle
  },
  {
    type: "js-evaluate",
    label: "Evaluate Expression",
    description: "Evaluates a JavaScript expression in the browser",
    color: "#DB2777",
    icon: "Pencil",
    settings: {
      expression: "window.location.href",
    },
    style: defaultStyle
  }
];
