
import { basicNodes } from './basic';
import { mouseNodes } from './mouseNodes';
import { keyboardNodes } from './keyboardNodes';
import { tabNodes } from './tabNodes';
import { timerNodes } from './timerNodes';
import { dataGenerationNodes } from './dataGeneration';
import { tableNodes } from './tableNodes';
import { mathNodes } from './mathNodes';
import { linkenSphereNodes } from './linkenSphereNodes';

export const nodes = [
  ...basicNodes,
  ...mouseNodes,
  ...keyboardNodes,
  ...tabNodes,
  ...timerNodes,
  ...dataGenerationNodes,
  ...tableNodes,
  ...mathNodes,
  ...linkenSphereNodes
];

export const nodeCategories = [
  {
    name: "Basic",
    nodes: basicNodes
  },
  {
    name: "Mouse",
    nodes: mouseNodes
  },
  {
    name: "Keyboard",
    nodes: keyboardNodes
  },
  {
    name: "Tabs",
    nodes: tabNodes
  },
  {
    name: "Timers",
    nodes: timerNodes
  },
  {
    name: "Data Generation",
    nodes: dataGenerationNodes
  },
  {
    name: "Tables",
    nodes: tableNodes
  },
  {
    name: "Math Operations",
    nodes: mathNodes
  },
  {
    name: "Linken Sphere API",
    nodes: linkenSphereNodes
  }
];
