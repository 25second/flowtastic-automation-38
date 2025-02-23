
import { FlowNodeWithData } from '@/types/flow';

export const processMathAddNode = (node: FlowNodeWithData) => {
  const { a = 0, b = 0 } = node.data.settings || {};
  return `
    console.log('Adding numbers:', { a: ${a}, b: ${b} });
    const result = ${a} + ${b};
    console.log('Result:', result);
    global.nodeOutputs['${node.id}'] = { result };`;
};

export const processMathSubtractNode = (node: FlowNodeWithData) => {
  const { a = 0, b = 0 } = node.data.settings || {};
  return `
    console.log('Subtracting numbers:', { a: ${a}, b: ${b} });
    const result = ${a} - ${b};
    console.log('Result:', result);
    global.nodeOutputs['${node.id}'] = { result };`;
};

export const processMathMultiplyNode = (node: FlowNodeWithData) => {
  const { a = 0, b = 0 } = node.data.settings || {};
  return `
    console.log('Multiplying numbers:', { a: ${a}, b: ${b} });
    const result = ${a} * ${b};
    console.log('Result:', result);
    global.nodeOutputs['${node.id}'] = { result };`;
};

export const processMathDivideNode = (node: FlowNodeWithData) => {
  const { a = 0, b = 1 } = node.data.settings || {};
  return `
    console.log('Dividing numbers:', { a: ${a}, b: ${b} });
    if (${b} === 0) {
      throw new Error('Division by zero');
    }
    const result = ${a} / ${b};
    console.log('Result:', result);
    global.nodeOutputs['${node.id}'] = { result };`;
};

export const processMathRandomNode = (node: FlowNodeWithData) => {
  const { max = 10 } = node.data.settings || {};
  return `
    console.log('Generating random number up to:', ${max});
    const result = Math.random() * ${max};
    console.log('Result:', result);
    global.nodeOutputs['${node.id}'] = { result };`;
};
