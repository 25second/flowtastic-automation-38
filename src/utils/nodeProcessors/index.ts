
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { processTabNode } from './tabNodes';
import { processKeyboardNode } from './keyboardNodes';
import { processMouseNode } from './mouseNodes';
import { processTableNode } from './tableNodes';
import { processWaitNode } from './timerNodes';
import { processMathNode } from './mathNodes';
import { processLinkenSphereNode } from './linkenSphereNodes';
import { processAiNode } from './aiNodes';

export const processNode = (
  node: FlowNodeWithData,
  connections?: Array<{
    sourceNode?: FlowNodeWithData;
    sourceHandle?: string | null;
    targetHandle?: string | null;
  }>
): string => {
  const { type } = node;

  // Handle different node categories
  if (type?.startsWith('new-tab') || type?.startsWith('switch-tab') || 
      type?.startsWith('wait-for-tab') || type?.startsWith('close-tab') || 
      type?.startsWith('reload-page')) {
    return processTabNode(node);
  }

  if (type?.startsWith('keyboard-')) {
    return processKeyboardNode(node);
  }

  if (type?.startsWith('mouse-')) {
    return processMouseNode(node);
  }

  if (type?.startsWith('table-')) {
    return processTableNode(node);
  }

  if (type?.startsWith('wait-')) {
    return processWaitNode(node);
  }

  if (type?.startsWith('math-')) {
    return processMathNode(node);
  }

  if (type?.startsWith('linken-sphere-')) {
    return processLinkenSphereNode(node);
  }

  if (type?.startsWith('ai-')) {
    return processAiNode(node);
  }

  // Handle unknown node types
  return '';
};
