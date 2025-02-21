
import { FlowNode } from '@/types/flow';

export const apiNodes: FlowNode[] = [
  {
    type: "http-request",
    label: "HTTP Request",
    description: "Sends HTTP request and receives response",
    color: "#6366F1",
    icon: "Globe",
    settings: {
      method: "GET",
      url: "",
      headers: "{}",
      body: "{}",
      waitForResponse: true
    }
  }
];
