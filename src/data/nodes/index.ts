
import { NodeCategory } from '@/types/flow';
import { basicNodes } from './basic';
import { dataGenerationNodes } from './dataGeneration';
import { tabNodes } from './tabNodes';

export const nodeCategories: NodeCategory[] = [
  {
    name: "Basic",
    nodes: basicNodes
  },
  {
    name: "Data Generation",
    nodes: dataGenerationNodes
  },
  {
    name: "Tab Nodes",
    nodes: tabNodes
  }
];

export default nodeCategories;
