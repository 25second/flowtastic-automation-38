
import { FlowNode } from '@/types/flow';

export const mouseNodes: FlowNode[] = [
  {
    type: "mouse-click",
    label: "Mouse Click",
    description: "Click on an element",
    color: "#F59E0B",
    icon: "MousePointer",
    settings: {
      selector: '',
      modifiers: []
    }
  },
  {
    type: "mouse-click-modified",
    label: "Modified Click",
    description: "Click with keyboard modifiers (Ctrl, Alt, Shift)",
    color: "#F59E0B",
    icon: "MousePointerClick",
    settings: {
      selector: '',
      modifiers: ['Control']
    }
  },
  {
    type: "mouse-double-click",
    label: "Double Click",
    description: "Double click on an element",
    color: "#F59E0B",
    icon: "MousePointerSquare",
    settings: {
      selector: ''
    }
  },
  {
    type: "mouse-hover",
    label: "Mouse Hover",
    description: "Hover over an element",
    color: "#F59E0B",
    icon: "MousePointerSquareDashed",
    settings: {
      selector: ''
    }
  },
  {
    type: "mouse-move",
    label: "Mouse Move",
    description: "Move mouse to specific coordinates",
    color: "#F59E0B",
    icon: "Move",
    settings: {
      x: 0,
      y: 0
    }
  },
  {
    type: "mouse-drag-drop",
    label: "Drag and Drop",
    description: "Drag from one point and drop to another",
    color: "#F59E0B",
    icon: "GripHorizontal",
    settings: {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }
  },
  {
    type: "mouse-wheel",
    label: "Mouse Wheel",
    description: "Scroll using mouse wheel",
    color: "#F59E0B",
    icon: "ArrowUpDown",
    settings: {
      deltaX: 0,
      deltaY: 100
    }
  }
];
