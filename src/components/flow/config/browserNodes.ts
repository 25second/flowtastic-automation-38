
import { FlowNode } from '@/types/flow';
import { defaultStyle } from './styles';

export const browserNodes: FlowNode[] = [
  {
    type: "tab-new",
    label: "New Tab",
    description: "Opens a new tab in the browser",
    color: "#059669",
    icon: "Globe",
    settings: {
      url: "https://www.google.com",
    },
    style: defaultStyle
  },
  {
    type: "tab-close",
    label: "Close Tab",
    description: "Closes the current tab in the browser",
    color: "#059669",
    icon: "Trash2",
    settings: {},
    style: defaultStyle
  },
  {
    type: "tab-switch",
    label: "Switch Tab",
    description: "Switches to a specific tab in the browser",
    color: "#059669",
    icon: "RefreshCw",
    settings: {
      tabId: "123",
    },
    style: defaultStyle
  }
];
