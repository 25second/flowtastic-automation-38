
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { processTabNode } from './tabNodes';
import { processKeyboardNode } from './keyboardNodes';
import { processReadTableNode, processWriteTableNode } from './tableNodes';
import { 
  processWaitTimeoutNode,
  processWaitElementNode,
  processWaitElementHiddenNode,
  processWaitFunctionNode,
  processWaitNavigationNode,
  processWaitLoadNode,
  processWaitNetworkIdleNode,
  processWaitDomLoadedNode
} from './timerNodes';
import { 
  processMathAddNode,
  processMathSubtractNode,
  processMathMultiplyNode,
  processMathDivideNode,
  processMathRandomNode
} from './mathNodes';
import { processLinkenSphereStopSessionNode } from './linkenSphereNodes';
import { processAIActionNode, processAIBrowserActionNode } from './aiNodes';

export const processNode = (
  node: FlowNodeWithData,
  connections: Array<{
    sourceNode?: FlowNodeWithData;
    sourceHandle?: string | null;
    targetHandle?: string | null;
  }> = []
): string => {
  const { type } = node;

  // Handle different node categories
  if (type?.startsWith('new-tab') || type?.startsWith('switch-tab') || 
      type?.startsWith('wait-for-tab') || type?.startsWith('close-tab') || 
      type?.startsWith('reload-page')) {
    return processTabNode(node);
  }

  if (type?.startsWith('keyboard-')) {
    return processKeyboardNode(node, connections);
  }

  if (type?.startsWith('table-')) {
    if (type === 'table-read') {
      return processReadTableNode(node);
    }
    if (type === 'table-write') {
      return processWriteTableNode(node);
    }
  }

  if (type?.startsWith('wait-')) {
    switch (type) {
      case 'wait-timeout':
        return processWaitTimeoutNode(node);
      case 'wait-element':
        return processWaitElementNode(node);
      case 'wait-element-hidden':
        return processWaitElementHiddenNode(node);
      case 'wait-function':
        return processWaitFunctionNode(node);
      case 'wait-navigation':
        return processWaitNavigationNode(node);
      case 'wait-load':
        return processWaitLoadNode(node);
      case 'wait-network-idle':
        return processWaitNetworkIdleNode(node);
      case 'wait-dom-loaded':
        return processWaitDomLoadedNode(node);
    }
  }

  if (type?.startsWith('math-')) {
    switch (type) {
      case 'math-add':
        return processMathAddNode(node);
      case 'math-subtract':
        return processMathSubtractNode(node);
      case 'math-multiply':
        return processMathMultiplyNode(node);
      case 'math-divide':
        return processMathDivideNode(node);
      case 'math-random':
        return processMathRandomNode(node);
    }
  }

  if (type?.startsWith('linken-sphere-')) {
    if (type === 'linken-sphere-stop-session') {
      return processLinkenSphereStopSessionNode(node);
    }
  }

  if (type?.startsWith('ai-')) {
    if (type === 'ai-action') {
      return processAIActionNode(node);
    }
    if (type === 'ai-browser-action') {
      return processAIBrowserActionNode(node);
    }
  }

  // Handle unknown node types
  return '';
};
