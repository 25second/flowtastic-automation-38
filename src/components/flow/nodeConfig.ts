
import { nodeCategories as importedNodeCategories } from '@/data/nodes';
import { NodeCategory, FlowNode } from '@/types/flow';
import { LucideIcon } from 'lucide-react';
import { 
  Calendar, 
  Play,
  StopCircle, 
  Globe, 
  MoveHorizontal,
  X, 
  MousePointer, 
  Type,
  FileDown, 
  Save, 
  FileText,
  Timer,
  GitBranch,
  FileSpreadsheet,
  FileUp,
  Code
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'Play': Play,
  'StopCircle': StopCircle,
  'Globe': Globe,
  'MoveHorizontal': MoveHorizontal,
  'X': X,
  'MousePointer': MousePointer,
  'Type': Type,
  'FileDown': FileDown,
  'Save': Save,
  'FileText': FileText,
  'Timer': Timer,
  'GitBranch': GitBranch,
  'FileSpreadsheet': FileSpreadsheet,
  'FileUp': FileUp,
  'Code': Code
};

const nodeStyle = {
  background: '#fff',
  padding: '15px',
  borderRadius: '8px',
  width: 180,
};

// Process the categories and add icons and styles
export const nodeCategories: NodeCategory[] = importedNodeCategories.map(category => ({
  name: category.name,
  nodes: category.nodes.map(node => ({
    ...node,
    icon: iconMap[node.icon as keyof typeof iconMap],
    color: node.color || '#9b87f5',
    style: nodeStyle
  }))
}));

export const initialNodes = [
  {
    id: '1',
    type: 'start',
    data: { 
      label: 'Start',
      settings: {}
    },
    position: { x: 250, y: 25 },
    style: nodeStyle,
  },
];
