
import { FlowNodeWithData } from '@/types/flow';
import { processStartNode, processEndNode, processSessionStopNode } from './basicNodes';
import { processOpenPageNode, processNavigateNode, processCloseTabNode } from './browserNodes';
import { processClickNode, processInputNode } from './interactionNodes';
import { processExtractNode, processSaveDataNode } from './dataNodes';
import { processWaitNode, processConditionNode } from './flowControlNodes';
import { processHttpRequestNode } from './apiNodes';
import { processRunScriptNode } from './scriptNodes';
import { processGeneratePersonNode } from './dataGenerationNodes';
import { 
  processNewTabNode,
  processSwitchTabNode,
  processWaitForTabNode
} from './tabNodes';
import { processKeyboardNode } from './keyboardNodes';

export const processNode = (node: FlowNodeWithData) => {
  // Add debug logging
  console.log('Processing node:', {
    type: node.type,
    label: node.data.label,
    settings: node.data.settings
  });

  // Обрабатываем клавиатурные ноды
  if (node.type.startsWith('keyboard-')) {
    return processKeyboardNode(node);
  }

  switch (node.type) {
    case 'start':
      return processStartNode();
    case 'end':
      return processEndNode();
    case 'open-page':
      return processOpenPageNode(node);
    case 'navigate':
      return processNavigateNode(node);
    case 'close-tab':
      return processCloseTabNode();
    case 'click':
      return processClickNode(node);
    case 'page-click':
      return processClickNode(node);
    case 'input-text':
    case 'page-type':
      return processInputNode(node);
    case 'extract':
      return processExtractNode(node);
    case 'save-data':
      return processSaveDataNode(node);
    case 'wait':
      return processWaitNode(node);
    case 'condition':
      return processConditionNode(node);
    case 'http-request':
      return processHttpRequestNode(node);
    case 'run-script':
      return processRunScriptNode(node);
    case 'session-stop':
      return processSessionStopNode();
    case 'generate-person':
      return processGeneratePersonNode(node);
    case 'new-tab':
      return processNewTabNode(node);
    case 'switch-tab':
      return processSwitchTabNode(node);
    case 'wait-for-tab':
      return processWaitForTabNode(node);
    default:
      console.error('Unknown node type:', node.type);
      console.error('Node data:', node);
      return `
    // Unknown node type: ${node.type}
    throw new Error("Unknown node type: ${node.type}");`;
  }
};
