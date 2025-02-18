import { FlowNode, NodeCategory } from '@/types/flow';
import { 
  Globe, Play, Timer, Mouse, Keyboard, Download, Upload, 
  Pencil, Trash2, Calendar, Repeat, GitBranch, RefreshCw, 
  StopCircle, StickyNote, Group 
} from 'lucide-react';

const defaultStyle = {
  background: '#ffffff',
  padding: '10px',
  borderRadius: '8px',
  width: 200
};

export const nodeCategories: NodeCategory[] = [
  {
    name: "Triggers",
    nodes: [
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
        style: defaultStyle
      },
      {
        type: "tab-close",
        label: "Close Tab",
        description: "Closes the current tab in the browser",
        color: "#059669",
        icon: "Trash2",
        settings: {},
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
        style: defaultStyle
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
    ]
  }
];
