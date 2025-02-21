
import { FlowNode } from '@/types/flow';

export const interactionNodes: FlowNode[] = [
  {
    type: "page-click",
    label: "Click Element",
    description: "Clicks on a specified element",
    color: "#F97316",
    icon: "MousePointer",
    settings: {
      selector: "",
      clickType: "single", // single, double, right
      delay: 0,
      button: "left", // left, right, middle
      clickCount: 1,
      waitForSelector: true
    }
  },
  {
    type: "page-type",
    label: "Type Text",
    description: "Types text into an input field",
    color: "#06B6D4",
    icon: "Type",
    settings: {
      selector: "",
      text: "",
      delay: 0,
      waitForSelector: true
    }
  },
  {
    type: "page-wait-for",
    label: "Wait For Element",
    description: "Waits for an element to appear on the page",
    color: "#F97316",
    icon: "Timer",
    settings: {
      selector: "",
      timeout: 30000,
      visible: true,
      hidden: false
    }
  },
  {
    type: "page-focus",
    label: "Focus Element",
    description: "Focuses on a specified element",
    color: "#F97316",
    icon: "Target",
    settings: {
      selector: "",
      waitForSelector: true
    }
  },
  {
    type: "page-hover",
    label: "Hover Element",
    description: "Hovers over a specified element",
    color: "#F97316",
    icon: "MousePointer",
    settings: {
      selector: "",
      waitForSelector: true
    }
  },
  {
    type: "page-keyboard",
    label: "Keyboard Press",
    description: "Simulates keyboard key press",
    color: "#06B6D4",
    icon: "Keyboard",
    settings: {
      key: "",
      text: "",
      delay: 0
    }
  },
  {
    type: "page-select",
    label: "Select Option",
    description: "Selects an option from a dropdown",
    color: "#06B6D4",
    icon: "List",
    settings: {
      selector: "",
      value: "",
      waitForSelector: true
    }
  },
  {
    type: "page-scroll",
    label: "Scroll Page",
    description: "Scrolls the page",
    color: "#F97316",
    icon: "MoveVertical",
    settings: {
      selector: "",
      scrollX: 0,
      scrollY: 0,
      behavior: "smooth"
    }
  },
  {
    type: "page-wait",
    label: "Wait Timeout",
    description: "Waits for a specified time",
    color: "#F97316",
    icon: "Clock",
    settings: {
      timeout: 1000
    }
  }
];
