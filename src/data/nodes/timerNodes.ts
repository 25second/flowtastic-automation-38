
import { FlowNode } from "@/types/flow";
import { Timer, Eye, EyeOff, Function, Navigation, Globe, Loader, FileCode } from 'lucide-react';

export const timerNodes: FlowNode[] = [
  {
    type: 'wait-timeout',
    label: 'Wait Timeout',
    description: 'Waits for a specified amount of time',
    settings: {
      timeout: 2000
    },
    color: '#FF9800',
    icon: Timer,
  },
  {
    type: 'wait-element',
    label: 'Wait For Element',
    description: 'Waits for an element to appear on the page',
    settings: {
      selector: '.my-element',
      timeout: 30000
    },
    color: '#4CAF50',
    icon: Eye,
  },
  {
    type: 'wait-element-hidden',
    label: 'Wait For Element Hidden',
    description: 'Waits for an element to disappear from the page',
    settings: {
      selector: '.my-element',
      timeout: 30000
    },
    color: '#F44336',
    icon: EyeOff,
  },
  {
    type: 'wait-function',
    label: 'Wait For Function',
    description: 'Waits for a JavaScript function to return true',
    settings: {
      function: "() => document.querySelector('.my-element') !== null",
      timeout: 30000
    },
    color: '#2196F3',
    icon: Function,
  },
  {
    type: 'wait-navigation',
    label: 'Wait For Navigation',
    description: 'Waits for page navigation to complete after clicking an element',
    settings: {
      selector: 'a',
      timeout: 30000
    },
    color: '#9C27B0',
    icon: Navigation,
  },
  {
    type: 'wait-load',
    label: 'Wait For Page Load',
    description: 'Waits for the page to finish loading',
    settings: {
      state: 'networkidle',
      timeout: 30000
    },
    color: '#00BCD4',
    icon: Globe,
  },
  {
    type: 'wait-network-idle',
    label: 'Wait For Network Idle',
    description: 'Waits for network activity to stop',
    settings: {
      timeout: 30000
    },
    color: '#795548',
    icon: Loader,
  },
  {
    type: 'wait-dom-loaded',
    label: 'Wait For DOM Loaded',
    description: 'Waits for DOM content to be fully loaded',
    settings: {
      timeout: 30000
    },
    color: '#607D8B',
    icon: FileCode,
  }
];
