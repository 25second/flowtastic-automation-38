
import { FlowNode } from '@/types/flow';

export const excelNodes: FlowNode[] = [
  {
    type: "read-excel",
    label: "Read Excel",
    description: "Reads data from Excel file",
    color: "#059669",
    icon: "FileSpreadsheet",
    settings: {
      filePath: "",
      sheet: "Sheet1",
      range: ""
    }
  },
  {
    type: "write-excel",
    label: "Write Excel",
    description: "Writes data to Excel file",
    color: "#0D9488",
    icon: "FileUp",
    settings: {
      filePath: "",
      sheet: "Sheet1",
      range: ""
    }
  }
];
