
import { processStartNode, processEndNode, processSessionStopNode } from './basicNodes';
import { processExtractNode, processSaveDataNode } from './dataNodes';
import { processWaitNode, processConditionNode } from './flowControlNodes';
import { processClickNode, processInputNode } from './interactionNodes';
import { processKeyboardNode } from './keyboardNodes';
import { processRunScriptNode } from './scriptNodes';
import { processNewTabNode, processSwitchTabNode, processWaitForTabNode, processCloseTabNode } from './tabNodes';
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
import { processAIActionNode } from './aiNodes';
import { FlowNodeWithData } from '@/types/flow';

export const processNode = (node: FlowNodeWithData): string => {
  const nodeType = node.type;

  // Basic nodes
  if (nodeType === 'start-script') {
    return processStartNode();
  }
  if (nodeType === 'stop') {
    return processEndNode();
  }
  if (nodeType === 'stop-session') {
    return processSessionStopNode();
  }

  // Data nodes
  if (nodeType === 'data-extract') {
    return processExtractNode(node);
  }
  if (nodeType === 'data-save') {
    return processSaveDataNode(node);
  }

  // Flow control nodes
  if (nodeType === 'flow-wait') {
    return processWaitNode(node);
  }
  if (nodeType === 'flow-condition') {
    return processConditionNode(node);
  }

  // Interaction nodes
  if (nodeType.startsWith('mouse-')) {
    return processClickNode(node);
  }
  if (nodeType === 'interaction-input') {
    return processInputNode(node);
  }

  // Keyboard nodes
  if (nodeType.startsWith('keyboard-')) {
    return processKeyboardNode(node, []);
  }

  // Script nodes
  if (nodeType === 'script-run') {
    return processRunScriptNode(node);
  }

  // Tab nodes
  if (nodeType === 'new-tab') {
    return processNewTabNode(node);
  }
  if (nodeType === 'switch-tab') {
    return processSwitchTabNode(node);
  }
  if (nodeType === 'wait-for-tab') {
    return processWaitForTabNode(node);
  }
  if (nodeType === 'close-tab') {
    return processCloseTabNode(node);
  }

  // Table nodes
  if (nodeType === 'read-table') {
    return processReadTableNode(node);
  }
  if (nodeType === 'write-table') {
    return processWriteTableNode(node);
  }

  // Timer nodes
  if (nodeType === 'wait-timeout') {
    return processWaitTimeoutNode(node);
  }
  if (nodeType === 'wait-element') {
    return processWaitElementNode(node);
  }
  if (nodeType === 'wait-element-hidden') {
    return processWaitElementHiddenNode(node);
  }
  if (nodeType === 'wait-function') {
    return processWaitFunctionNode(node);
  }
  if (nodeType === 'wait-navigation') {
    return processWaitNavigationNode(node);
  }
  if (nodeType === 'wait-load') {
    return processWaitLoadNode(node);
  }
  if (nodeType === 'wait-network-idle') {
    return processWaitNetworkIdleNode(node);
  }
  if (nodeType === 'wait-dom-loaded') {
    return processWaitDomLoadedNode(node);
  }

  // Math nodes
  if (nodeType === 'math-add') {
    return processMathAddNode(node);
  }
  if (nodeType === 'math-subtract') {
    return processMathSubtractNode(node);
  }
  if (nodeType === 'math-multiply') {
    return processMathMultiplyNode(node);
  }
  if (nodeType === 'math-divide') {
    return processMathDivideNode(node);
  }
  if (nodeType === 'math-random') {
    return processMathRandomNode(node);
  }

  // AI Action node
  if (nodeType === 'ai-action') {
    return processAIActionNode(node);
  }

  return '';
};
