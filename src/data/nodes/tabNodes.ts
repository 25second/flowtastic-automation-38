
import { FlowNode } from "@/types/flow";
import { 
  Square, 
  SplitSquareHorizontal, 
  Timer, 
  X 
} from 'lucide-react';

export const tabNodes: FlowNode[] = [
  {
    type: 'new-tab',
    label: 'Create New Tab',
    description: 'Creates a new browser tab and optionally navigates to the specified URL',
    settings: {
      url: ''
    },
    color: '#4CAF50',
    icon: Square,
  },
  {
    type: 'switch-tab',
    label: 'Switch Tab',
    description: 'Switches focus between browser tabs',
    settings: {
      fromIndex: 0,
      toIndex: 1
    },
    color: '#2196F3',
    icon: SplitSquareHorizontal,
  },
  {
    type: 'wait-for-tab',
    label: 'Wait For Tab',
    description: 'Waits for a new tab to open after clicking an element',
    settings: {
      selector: 'a[target="_blank"]'
    },
    color: '#FF9800',
    icon: Timer,
  },
  {
    type: 'close-tab',
    label: 'Close Tab',
    description: 'Closes the specified browser tab',
    settings: {
      index: 'current'
    },
    color: '#F44336',
    icon: X,
  }
];
