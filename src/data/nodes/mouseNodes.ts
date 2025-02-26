
import { FlowNode } from "@/types/flow";
import { 
  MousePointer, 
  MousePointerClick,
  PointerIcon,
  Target,
  MoveHorizontal,
  ArrowUpDown
} from 'lucide-react';

export const mouseNodes: FlowNode[] = [
  {
    type: "mouse-click",
    label: "Mouse Click",
    description: "Click on an element",
    color: "#F59E0B",
    icon: MousePointer,
    settings: {
      selector: '',
      modifiers: [],
      inputs: [
        { id: "selector", label: "Selector" }
      ]
    }
  },
  {
    type: "mouse-click-modified",
    label: "Modified Click",
    description: "Click with keyboard modifiers (Ctrl, Alt, Shift)",
    color: "#F59E0B",
    icon: MousePointerClick,
    settings: {
      selector: '',
      modifiers: ['Control'],
      inputs: [
        { id: "selector", label: "Selector" },
        { id: "modifiers", label: "Modifiers" }
      ]
    }
  },
  {
    type: "mouse-double-click",
    label: "Double Click",
    description: "Double click on an element",
    color: "#F59E0B",
    icon: PointerIcon,
    settings: {
      selector: '',
      inputs: [
        { id: "selector", label: "Selector" }
      ]
    }
  },
  {
    type: "mouse-hover",
    label: "Mouse Hover",
    description: "Hover over an element",
    color: "#F59E0B",
    icon: Target,
    settings: {
      selector: '',
      inputs: [
        { id: "selector", label: "Selector" }
      ]
    }
  },
  {
    type: "mouse-move",
    label: "Mouse Move",
    description: "Move mouse to specific coordinates",
    color: "#F59E0B",
    icon: MoveHorizontal,
    settings: {
      x: 0,
      y: 0,
      inputs: [
        { id: "x", label: "X Coordinate" },
        { id: "y", label: "Y Coordinate" }
      ]
    }
  },
  {
    type: "mouse-drag-drop",
    label: "Drag and Drop",
    description: "Drag from one point and drop to another",
    color: "#F59E0B",
    icon: MousePointer,
    settings: {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      inputs: [
        { id: "startX", label: "Start X" },
        { id: "startY", label: "Start Y" },
        { id: "endX", label: "End X" },
        { id: "endY", label: "End Y" }
      ]
    }
  },
  {
    type: "mouse-wheel",
    label: "Mouse Wheel",
    description: "Scroll using mouse wheel",
    color: "#F59E0B",
    icon: ArrowUpDown,
    settings: {
      deltaX: 0,
      deltaY: 100,
      inputs: [
        { id: "deltaX", label: "Delta X" },
        { id: "deltaY", label: "Delta Y" }
      ]
    }
  }
];
