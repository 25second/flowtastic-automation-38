
import { FlowNode } from "@/types/flow";
import { 
  KeyboardIcon, 
  ArrowDownToLine,
  ArrowDown,
  Copy,
  MousePointer
} from 'lucide-react';

export const keyboardNodes: FlowNode[] = [
  {
    type: 'keyboard-type',
    label: 'Type Text',
    description: 'Types the specified text using the keyboard',
    settings: {
      text: '',
      delay: 0
    },
    color: '#9333EA',
    icon: KeyboardIcon,
    style: {
      background: '#fff',
      padding: '15px',
      borderRadius: '8px',
      width: 180
    }
  },
  {
    type: 'keyboard-press',
    label: 'Press Key',
    description: 'Presses a specific keyboard key',
    settings: {
      key: 'Enter'
    },
    color: '#7C3AED',
    icon: ArrowDownToLine,
    style: {
      background: '#fff',
      padding: '15px',
      borderRadius: '8px',
      width: 180
    }
  },
  {
    type: 'keyboard-down',
    label: 'Hold Key',
    description: 'Holds down a specific keyboard key',
    settings: {
      key: 'Shift',
      duration: 1000
    },
    color: '#6D28D9',
    icon: ArrowDown,
    style: {
      background: '#fff',
      padding: '15px',
      borderRadius: '8px',
      width: 180
    }
  },
  {
    type: 'keyboard-shortcut',
    label: 'Keyboard Shortcut',
    description: 'Simulates keyboard shortcuts like Ctrl+C, Ctrl+V',
    settings: {
      shortcut: 'Control+C'
    },
    color: '#5B21B6',
    icon: Copy,
    style: {
      background: '#fff',
      padding: '15px',
      borderRadius: '8px',
      width: 180
    }
  },
  {
    type: 'keyboard-focus-type',
    label: 'Focus and Type',
    description: 'Focuses on an element and types text into it',
    settings: {
      selector: 'input#username',
      text: '',
      delay: 0
    },
    color: '#4C1D95',
    icon: MousePointer,
    style: {
      background: '#fff',
      padding: '15px',
      borderRadius: '8px',
      width: 180
    }
  }
];
