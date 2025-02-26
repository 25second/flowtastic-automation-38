
import { FlowNodeWithData } from '@/types/flow';

const createNode = (action: string, lineNumber: number): FlowNodeWithData => {
  return {
    id: `node-${lineNumber}`,
    type: 'default',
    position: { x: 100, y: lineNumber * 100 },
    data: {
      type: 'default',
      label: action,
      settings: {},
      description: `Line ${lineNumber}`
    }
  };
};

export const convertPuppeteerToNodes = (script: string): FlowNodeWithData[] => {
  const lines = script.split('\n').filter(line => line.trim() !== '');
  const nodes: FlowNodeWithData[] = lines.map((line, index) => {
    return createNode(line, index + 1);
  });
  return nodes;
};

// Export processNodes as an alias of convertPuppeteerToNodes for backward compatibility
export const processNodes = convertPuppeteerToNodes;
