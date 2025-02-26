
import { basicNodes } from './basic';
import { mouseNodes } from './mouseNodes';
import { keyboardNodes } from './keyboardNodes';
import { tabNodes } from './tabNodes';
import { timerNodes } from './timerNodes';
import { dataGenerationNodes } from './dataGeneration';
import { tableNodes } from './tableNodes';
import { mathNodes } from './mathNodes';
import { linkenSphereNodes } from './linkenSphereNodes';
import { aiNodes } from './aiNodes';

// Combine AI and data generation nodes into one category
const aiActionNodes = [...dataGenerationNodes, ...aiNodes];

export const nodes = [
  ...basicNodes,
  ...aiActionNodes,
  ...mouseNodes,
  ...keyboardNodes,
  ...tabNodes,
  ...timerNodes,
  ...tableNodes,
  ...mathNodes,
  ...linkenSphereNodes,
];

export const nodeCategories = [
  {
    name: "Basic",
    nodes: basicNodes
  },
  {
    name: "AI Actions",
    nodes: aiActionNodes
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
