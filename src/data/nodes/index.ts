
import { NodeCategory } from '@/types/flow';
import { basicNodes } from './basic';
import { dataGenerationNodes } from './dataGeneration';

export const nodeCategories: NodeCategory[] = [
  {
    name: "Basic",
    nodes: basicNodes
  },
  {
    name: "Data Generation",
    nodes: dataGenerationNodes
  }
];

export default nodeCategories;
