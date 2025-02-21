
import { NodeCategory } from '@/types/flow';
import { basicNodes } from './basic';
import { browserNodes } from './browser';
import { interactionNodes } from './interaction';
import { dataNodes } from './data';
import { flowNodes } from './flow';
import { excelNodes } from './excel';
import { apiNodes } from './api';
import { codeNodes } from './code';
import { linkenSphereNodes } from './linkenSphere';

export const nodeCategories: NodeCategory[] = [
  {
    name: "Basic",
    nodes: basicNodes
  },
  {
    name: "Browser Control",
    nodes: browserNodes
  },
  {
    name: "Page Interaction",
    nodes: interactionNodes
  },
  {
    name: "Data Processing",
    nodes: dataNodes
  },
  {
    name: "Flow Control",
    nodes: flowNodes
  },
  {
    name: "Excel",
    nodes: excelNodes
  },
  {
    name: "API",
    nodes: apiNodes
  },
  {
    name: "Code",
    nodes: codeNodes
  },
  {
    name: "LinkSphere",
    nodes: linkenSphereNodes
  }
];

export default nodeCategories;
