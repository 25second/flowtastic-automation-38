
import { FlowNode } from '@/types/flow';

export const dataNodes: FlowNode[] = [
  {
    type: "extract",
    label: "Extract Data",
    description: "Extracts data from the webpage",
    color: "#6366F1",
    icon: "FileDown",
    settings: {
      selector: "",
      dataType: "text",
      attribute: ""
    }
  },
  {
    type: "save-data",
    label: "Save Data",
    description: "Saves data to storage or file",
    color: "#8B5CF6",
    icon: "Save",
    settings: {
      format: "json",
      filePath: ""
    }
  },
  {
    type: "read-data",
    label: "Read Data",
    description: "Reads data from a file or source",
    color: "#EC4899",
    icon: "FileText",
    settings: {
      source: "file",
      filePath: ""
    }
  }
];
