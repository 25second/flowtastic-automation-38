
import nodesData from '@/data/nodes.json';
import { NodeCategory, FlowNode } from '@/types/flow';
import { LucideIcon } from 'lucide-react';
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
  Repeat,
  Clock,
  Globe,
  Send,
  PenSquare,
  Trash2,
  Play,
  StopCircle,
  FileText,
  Timer,
  FileSpreadsheet,
  FileUp,
  Type,
  MoveHorizontal
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'start': Play,
  'end': StopCircle,
  'open-page': Globe,
  'navigate': MoveHorizontal,
  'close-tab': X,
  'click': MousePointer,
  'input': Type,
  'extract': FileText,
  'save-data': Save,
  'read-data': Download,
  'wait': Timer,
  'condition': GitBranch,
  'read-excel': FileSpreadsheet,
  'write-excel': FileUp,
  'http-request': Globe,
  'run-script': Code,
  'session-stop': StopCircle,
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
  'flow-loop': Repeat,
  'flow-wait': Clock,
  'api-get': Globe,
  'api-post': Send,
  'api-put': PenSquare,
  'api-delete': Trash2
};

const colorMap: Record<string, string> = {
  'Basic': '#22C55E',
  'Browser Control': '#3B82F6',
  'Page Interaction': '#F97316',
  'Data Processing': '#6366F1',
  'Flow Control': '#F59E0B',
  'Excel': '#059669',
  'API': '#6366F1',
  'Code': '#8B5CF6',
  'LinkSphere': '#FDE1D3',
  'trigger': '#22C55E',
  'tab': '#3B82F6',
  'page': '#F97316',
  'js': '#8B5CF6',
  'screenshot': '#EC4899',
  'data': '#06B6D4',
  'flow': '#EF4444',
  'api': '#6366F1'
};

const nodeStyle = {
  background: '#fff',
  padding: '15px',
  borderRadius: '8px',
  width: 180,
};

// Process the JSON data and add icons, colors and styles
export const nodeCategories: NodeCategory[] = nodesData.categories.map(category => ({
  name: category.name,
  nodes: category.nodes.map(node => ({
    ...node,
    icon: iconMap[node.type],
    color: colorMap[category.name] || '#9b87f5',
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
