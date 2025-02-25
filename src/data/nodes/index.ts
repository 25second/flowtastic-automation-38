
import { basicNodes } from './basic';
import { mouseNodes } from './mouseNodes';
import { keyboardNodes } from './keyboardNodes';
import { tabNodes } from './tabNodes';
import { timerNodes } from './timerNodes';
import { tableNodes } from './tableNodes';
import { mathNodes } from './mathNodes';
import { linkenSphereNodes } from './linkenSphereNodes';
import { aiNodes } from './aiNodes';

export const nodes = [
  ...basicNodes,
  ...mouseNodes,
  ...keyboardNodes,
  ...tabNodes,
  ...timerNodes,
  ...tableNodes,
  ...mathNodes,
  ...linkenSphereNodes,
  ...aiNodes
];

export const nodeCategories = [
  {
    name: "Basic",
    nodes: basicNodes
  },
  {
    name: "AI Actions",
    nodes: aiNodes
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
