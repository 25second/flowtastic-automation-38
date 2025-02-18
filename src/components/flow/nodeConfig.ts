import { Globe, Play, Timer, Mouse, Keyboard, Download, Upload, Pencil, Trash2, Calendar, Repeat, GitBranch, RefreshCw, StopCircle } from 'lucide-react';
import type { NodeCategory, FlowNode } from '@/types/flow';

export const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 5 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
      width: 100,
    },
  },
];

export const nodeCategories: NodeCategory[] = [
  {
    name: "Triggers",
    nodes: [
      {
        type: "trigger-schedule",
        label: "Schedule",
        description: "Trigger workflow based on a schedule (cron)",
        color: "#4338CA",
        icon: "Calendar",
        settings: {
          cronExpression: "0 0 * * *",
        },
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
      },
    ]
  },
  {
    name: "Browser Actions",
    nodes: [
      {
        type: "tab-new",
        label: "New Tab",
        description: "Opens a new tab in the browser",
        color: "#059669",
        icon: "Globe",
        settings: {
          url: "https://www.google.com",
        },
      },
      {
        type: "tab-close",
        label: "Close Tab",
        description: "Closes the current tab in the browser",
        color: "#059669",
        icon: "Trash2",
        settings: {},
      },
      {
        type: "tab-switch",
        label: "Switch Tab",
        description: "Switches to a specific tab in the browser",
        color: "#059669",
        icon: "RefreshCw",
        settings: {
          tabId: "123",
        },
      },
      {
        type: "page-click",
        label: "Click",
        description: "Clicks on a specific element on the page",
        color: "#059669",
        icon: "Mouse",
        settings: {
          selector: "#my-button",
        },
      },
      {
        type: "page-type",
        label: "Type",
        description: "Types text into a specific element on the page",
        color: "#059669",
        icon: "Keyboard",
        settings: {
          selector: "#my-input",
          text: "Hello, world!",
        },
      },
      {
        type: "page-scroll",
        label: "Scroll",
        description: "Scrolls the page to a specific position",
        color: "#059669",
        icon: "Mouse",
        settings: {
          selector: "document.body",
          behavior: 'smooth',
        },
      },
    ]
  },
  {
    name: "JavaScript",
    nodes: [
      {
        type: "js-execute",
        label: "Execute Script",
        description: "Executes JavaScript code in the browser",
        color: "#DB2777",
        icon: "Play",
        settings: {
          code: "console.log('Hello, world!');",
        },
      },
      {
        type: "js-evaluate",
        label: "Evaluate Expression",
        description: "Evaluates a JavaScript expression in the browser",
        color: "#DB2777",
        icon: "Pencil",
        settings: {
          expression: "window.location.href",
        },
      },
    ]
  },
  {
    name: "Screenshot",
    nodes: [
      {
        type: "screenshot-full",
        label: "Full Page",
        description: "Takes a screenshot of the entire page",
        color: "#1E3A8A",
        icon: "Download",
        settings: {
          filename: "fullpage.png",
        },
      },
      {
        type: "screenshot-element",
        label: "Element",
        description: "Takes a screenshot of a specific element on the page",
        color: "#1E3A8A",
        icon: "Upload",
        settings: {
          selector: "#my-element",
          filename: "element.png",
        },
      },
    ]
  },
  {
    name: "Data",
    nodes: [
      {
        type: "data-extract",
        label: "Extract Data",
        description: "Extracts data from a specific element on the page",
        color: "#065F46",
        icon: "Download",
        settings: {
          selector: "#my-element",
          attribute: "innerText",
        },
      },
      {
        type: "data-save",
        label: "Save Data",
        description: "Saves data to a file",
        color: "#065F46",
        icon: "Upload",
        settings: {
          filename: "data.json",
          format: "json",
          data: {},
        },
      },
    ]
  },
  {
    name: "Flow Control",
    nodes: [
      {
        type: "flow-if",
        label: "If",
        description: "Conditional branching based on a condition",
        color: "#9A3412",
        icon: "GitBranch",
        settings: {
          condition: "data.value > 10",
        },
      },
      {
        type: "flow-loop",
        label: "Loop",
        description: "Loops through a set of actions",
        color: "#9A3412",
        icon: "Repeat",
        settings: {
          times: 5,
        },
      },
      {
        type: "flow-wait",
        label: "Wait",
        description: "Waits for a specific amount of time",
        color: "#9A3412",
        icon: "Timer",
        settings: {
          duration: 5,
        },
      },
    ]
  },
  {
    name: "API",
    nodes: [
      {
        type: "api-get",
        label: "GET Request",
        description: "Sends a GET request to a specific URL",
        color: "#7C2D12",
        icon: "Download",
        settings: {
          url: "https://api.example.com/data",
          headers: "{}",
          params: "{}",
        },
      },
      {
        type: "api-post",
        label: "POST Request",
        description: "Sends a POST request to a specific URL",
        color: "#7C2D12",
        icon: "Upload",
        settings: {
          url: "https://api.example.com/data",
          headers: "{}",
          body: "{}",
        },
      },
      {
        type: "api-put",
        label: "PUT Request",
        description: "Sends a PUT request to a specific URL",
        color: "#7C2D12",
        icon: "Pencil",
        settings: {
          url: "https://api.example.com/data/1",
          headers: "{}",
          body: "{}",
        },
      },
      {
        type: "api-delete",
        label: "DELETE Request",
        description: "Sends a DELETE request to a specific URL",
        color: "#7C2D12",
        icon: "Trash2",
        settings: {
          url: "https://api.example.com/data/1",
          headers: "{}",
        },
      },
    ]
  },
  {
    name: "Organization",
    nodes: [
      {
        type: "note",
        label: "Note",
        description: "Add notes to your workflow",
        color: "#FBC02D",
        icon: "Pencil",
        settings: {
          content: "Your note here"
        }
      },
      {
        type: "group",
        label: "Group",
        description: "Group related nodes together",
        color: "#9E86ED",
        icon: "Globe",
        settings: {
          name: "My Group"
        },
        style: {
          backgroundColor: "rgba(207, 182, 255, 0.2)",
          padding: "20px",
          borderRadius: "8px",
          width: 200
        }
      }
    ]
  },
];
