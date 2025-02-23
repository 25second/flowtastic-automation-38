
import { basicNodes } from './basic';
import { mouseNodes } from './mouseNodes';
import { keyboardNodes } from './keyboardNodes';
import { tabNodes } from './tabNodes';
import { timerNodes } from './timerNodes';
import { dataGenerationNodes } from './dataGeneration';
import { tableNodes } from './tableNodes';

export const nodes = [
  ...basicNodes,
  ...mouseNodes,
  ...keyboardNodes,
  ...tabNodes,
  ...timerNodes,
  ...dataGenerationNodes,
  ...tableNodes
];
