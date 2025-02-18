
import nodesData from '@/data/nodes.json';
import { NodeCategory, FlowNode } from '@/types/flow';
import { 
  Calendar, 
  BellRing, 
  TabletSmartphone, 
  X, 
  ArrowLeftRight, 
  MousePointer, 
  Keyboard, 
  ArrowDown, 
  Code, 
  Terminal, 
  Camera, 
  ImageDown, 
  Download, 
  Save, 
  GitBranch, 
  RepeatCircle, 
  Clock,
  Globe,
  Send,
  PenSquare,
  Trash2
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'trigger-schedule': Calendar,
  'trigger-event': BellRing,
  'tab-new': TabletSmartphone,
  'tab-close': X,
  'tab-switch': ArrowLeftRight,
  'page-click': MousePointer,
  'page-type': Keyboard,
  'page-scroll': ArrowDown,
  'js-execute': Code,
  'js-evaluate': Terminal,
  'screenshot-full': Camera,
  'screenshot-element': ImageDown,
  'data-extract': Download,
  'data-save': Save,
  'flow-if': GitBranch,
  'flow-loop': RepeatCircle,
  'flow-wait': Clock,
  'api-get': Globe,
  'api-post': Send,
  'api-put': PenSquare,
  'api-delete': Trash2
};

const nodeStyle = {
  background: '#fff',
  padding: '15px',
  borderRadius: '8px',
  width: 180,
};

const colorMap: Record<string, string> = {
  'trigger': '#22C55E',
  'tab': '#3B82F6',
  'page': '#F97316',
  'js': '#8B5CF6',
  'screenshot': '#EC4899',
  'data': '#06B6D4',
  'flow': '#EF4444',
  'api': '#6366F1'
};

// Process the JSON data and add common styles
export const nodeCategories: NodeCategory[] = nodesData.categories.map(category => ({
  name: category.name,
  nodes: category.nodes.map(node => {
    const nodeType = node.type.split('-')[0];
    return {
      ...node,
      icon: iconMap[node.type],
      color: colorMap[nodeType] || '#9b87f5',
      style: nodeStyle
    };
  })
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
    style: {
      background: '#fff',
      padding: '15px',
      borderRadius: '8px',
      width: 180,
    },
  },
];
