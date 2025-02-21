
import { FlowNode } from '@/types/flow';

export const browserNodes: FlowNode[] = [
  {
    type: "open-page",
    label: "Open Page",
    description: "Opens a specified webpage in the browser",
    color: "#3B82F6",
    icon: "Globe",
    settings: {
      url: "",
      openMethod: "current-tab"
    }
  },
  {
    type: "navigate",
    label: "Navigate Back/Forward",
    description: "Navigates through browser history",
    color: "#8B5CF6",
    icon: "MoveHorizontal",
    settings: {
      direction: "back"
    }
  },
  {
    type: "close-tab",
    label: "Close Tab",
    description: "Closes the current browser tab",
    color: "#EC4899",
    icon: "X",
    settings: {}
  }
];
