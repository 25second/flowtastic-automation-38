
import { NodeCategory } from '@/types/flow';
import { triggerNodes } from './config/triggerNodes';
import { browserNodes } from './config/browserNodes';
import { javascriptNodes } from './config/javascriptNodes';
import { organizationNodes } from './config/organizationNodes';

export const nodeCategories: NodeCategory[] = [
  {
    name: "Triggers",
    nodes: triggerNodes
  },
  {
    name: "Browser Actions",
    nodes: browserNodes
  },
  {
    name: "JavaScript",
    nodes: javascriptNodes
  },
  {
    name: "Organization",
    nodes: organizationNodes
  }
];
