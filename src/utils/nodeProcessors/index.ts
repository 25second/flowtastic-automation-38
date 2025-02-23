
import { FlowNodeWithData } from '@/types/flow';
import { processStartNode, processEndNode, processSessionStopNode } from './basicNodes';
import { processOpenPageNode, processNavigateNode, processCloseTabNode } from './browserNodes';
import { processClickNode, processInputNode } from './interactionNodes';
import { processExtractNode, processSaveDataNode } from './dataNodes';
import { processWaitNode, processConditionNode } from './flowControlNodes';
import { processHttpRequestNode } from './apiNodes';
import { processRunScriptNode } from './scriptNodes';
import { processGeneratePersonNode } from './dataGenerationNodes';
import { processReadTableNode, processWriteTableNode } from './tableNodes';
import { processKeyboardNode } from './keyboardNodes';

export const processNode = (node: FlowNodeWithData, connections: any[] = []) => {
  console.log('Processing node:', {
    type: node.type,
    label: node.data.label,
    settings: node.data.settings,
    connections
  });

  if (node.type.startsWith('keyboard-')) {
    return processKeyboardNode(node, connections);
  }

  switch (node.type) {
    case 'start':
      return processStartNode();
    case 'end':
      return processEndNode();
    case 'session-stop':
      return processSessionStopNode();
    case 'generate-person':
      return processGeneratePersonNode(node);
    case 'open-page':
      return processOpenPageNode(node);
    case 'navigate':
      return processNavigateNode(node);
    case 'close-tab':
      return processCloseTabNode(node);
    case 'click':
    case 'page-click':
      return processClickNode(node);
    case 'input-text':
    case 'page-type':
      return processInputNode(node, connections);
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
    case 'read-table':
      return processReadTableNode(node);
    case 'write-table':
      return processWriteTableNode(node);
    default:
      console.error('Unknown node type:', node.type);
      console.error('Node data:', node);
      return `
    // Unknown node type: ${node.type}
    throw new Error("Unknown node type: ${node.type}");`;
  }
};
