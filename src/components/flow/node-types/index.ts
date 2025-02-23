
type NodeTypesType = {
  [key: string]: React.ComponentType<any>;
};

// We'll import CustomNode when we create the nodeTypes object
export const getNodeTypes = (CustomNode: React.ComponentType<any>): NodeTypesType => ({
  'default': CustomNode,
  'input': CustomNode,
  'output': CustomNode,
  'generate-person': CustomNode,
  'start-script': CustomNode,
  'stop': CustomNode,
  'new-tab': CustomNode,
  'switch-tab': CustomNode,
  'wait-for-tab': CustomNode,
  'close-tab': CustomNode,
  'mouse-click': CustomNode,
  'mouse-click-modified': CustomNode,
  'mouse-double-click': CustomNode,
  'mouse-hover': CustomNode,
  'mouse-move': CustomNode,
  'mouse-drag-drop': CustomNode,
  'mouse-wheel': CustomNode,
  'keyboard-type': CustomNode,
  'keyboard-press': CustomNode,
  'keyboard-down': CustomNode,
  'keyboard-shortcut': CustomNode,
  'keyboard-focus-type': CustomNode,
  'read-table': CustomNode,
  'write-table': CustomNode,
  'wait-timeout': CustomNode,
  'wait-element': CustomNode,
  'wait-element-hidden': CustomNode,
  'wait-function': CustomNode,
  'wait-navigation': CustomNode,
  'wait-load': CustomNode,
  'wait-network-idle': CustomNode,
  'wait-dom-loaded': CustomNode,
  'math-add': CustomNode,
  'math-subtract': CustomNode,
  'math-multiply': CustomNode,
  'math-divide': CustomNode,
  'math-random': CustomNode
});
