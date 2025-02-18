
import { FlowNode } from '@/types/flow';
import { defaultStyle } from './styles';

export const organizationNodes: FlowNode[] = [
  {
    type: "note",
    label: "Note",
    description: "Add notes to your workflow",
    color: "#FBC02D",
    icon: "StickyNote",
    settings: {
      content: "Your note here"
    },
    style: {
      ...defaultStyle,
      background: '#FFF9C4'
    }
  },
  {
    type: "group",
    label: "Group",
    description: "Group related nodes together",
    color: "#9E86ED",
    icon: "Group",
    settings: {
      name: "My Group"
    },
    style: {
      background: 'rgba(207, 182, 255, 0.2)',
      padding: '20px',
      borderRadius: '8px',
      width: 200
    }
  }
];
