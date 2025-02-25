
import { processBasicNodes } from './basicNodes';
import { processDataNodes } from './dataNodes';
import { processFlowControlNodes } from './flowControlNodes';
import { processInteractionNodes } from './interactionNodes';
import { processKeyboardNodes } from './keyboardNodes';
import { processScriptNodes } from './scriptNodes';
import { processTabNodes } from './tabNodes';
import { processTableNodes } from './tableNodes';
import { processTimerNodes } from './timerNodes';
import { processMathNodes } from './mathNodes';
import { processLinkenSphereNodes } from './linkenSphereNodes';
import { processAIActionNode } from './aiNodes';
import { FlowNodeWithData } from '@/types/flow';

export const processNode = (node: FlowNodeWithData): string => {
  const nodeType = node.type;

  // Basic nodes
  if (nodeType.startsWith('basic-')) {
    return processBasicNodes(node);
  }

  // Data nodes
  if (nodeType.startsWith('data-')) {
    return processDataNodes(node);
  }

  // Flow control nodes
  if (nodeType.startsWith('flow-')) {
    return processFlowControlNodes(node);
  }

  // Interaction nodes
  if (nodeType.startsWith('interaction-')) {
    return processInteractionNodes(node);
  }

  // Keyboard nodes
  if (nodeType.startsWith('keyboard-')) {
    return processKeyboardNodes(node);
  }

  // Script nodes
  if (nodeType.startsWith('script-')) {
    return processScriptNodes(node);
  }

  // Tab nodes
  if (nodeType.startsWith('tab-')) {
    return processTabNodes(node);
  }

  // Table nodes
  if (nodeType.startsWith('table-')) {
    return processTableNodes(node);
  }

  // Timer nodes
  if (nodeType.startsWith('timer-')) {
    return processTimerNodes(node);
  }

  // Math nodes
  if (nodeType.startsWith('math-')) {
    return processMathNodes(node);
  }

  // LinkenSphere nodes
  if (nodeType.startsWith('linken-sphere-')) {
    return processLinkenSphereNodes(node);
  }

  // AI Action node
  if (nodeType === 'ai-action') {
    return processAIActionNode(node);
  }

  return '';
};
