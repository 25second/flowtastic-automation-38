
import { FlowNode } from '@/types/flow';
import { defaultStyle } from './styles';

export const triggerNodes: FlowNode[] = [
  {
    type: "trigger-schedule",
    label: "Schedule",
    description: "Trigger workflow based on a schedule (cron)",
    color: "#4338CA",
    icon: "Play",
    settings: {
      cronExpression: "0 0 * * *"
    },
    style: defaultStyle
  },
  {
    type: "trigger-event",
    label: "Event",
    description: "Trigger workflow based on an event",
    color: "#4338CA",
    icon: "Play",
    settings: {
      eventType: "page.loaded",
    },
    style: defaultStyle
  }
];
