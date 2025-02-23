
import { FlowNodeWithData } from '@/types/flow';

export const processMathAddNode = (node: FlowNodeWithData) => {
  return `
    const a = global.getNodeOutput('${node.id}', 'input-a') || 0;
    const b = global.getNodeOutput('${node.id}', 'input-b') || 0;
    console.log('Adding numbers:', { a, b });
    const result = Number(a) + Number(b);
    console.log('Result:', result);
    global.nodeOutputs['${node.id}'] = { result };`;
};

export const processMathSubtractNode = (node: FlowNodeWithData) => {
  return `
    const a = global.getNodeOutput('${node.id}', 'input-a') || 0;
    const b = global.getNodeOutput('${node.id}', 'input-b') || 0;
    console.log('Subtracting numbers:', { a, b });
    const result = Number(a) - Number(b);
    console.log('Result:', result);
    global.nodeOutputs['${node.id}'] = { result };`;
};

export const processMathMultiplyNode = (node: FlowNodeWithData) => {
  return `
    const a = global.getNodeOutput('${node.id}', 'input-a') || 0;
    const b = global.getNodeOutput('${node.id}', 'input-b') || 0;
    console.log('Multiplying numbers:', { a, b });
    const result = Number(a) * Number(b);
    console.log('Result:', result);
    global.nodeOutputs['${node.id}'] = { result };`;
};

export const processMathDivideNode = (node: FlowNodeWithData) => {
  return `
    const a = global.getNodeOutput('${node.id}', 'input-a') || 0;
    const b = global.getNodeOutput('${node.id}', 'input-b') || 0;
    console.log('Dividing numbers:', { a, b });
    if (Number(b) === 0) {
      throw new Error('Division by zero');
    }
    const result = Number(a) / Number(b);
    console.log('Result:', result);
    global.nodeOutputs['${node.id}'] = { result };`;
};

export const processMathRandomNode = (node: FlowNodeWithData) => {
  return `
    const max = global.getNodeOutput('${node.id}', 'input-max') || 10;
    console.log('Generating random number up to:', max);
    const result = Math.random() * Number(max);
    console.log('Result:', result);
    global.nodeOutputs['${node.id}'] = { result };`;
};
