
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Square, 
  Save,
  Download,
  Upload,
  Settings
} from "lucide-react";
import { useFlowstream } from "./FlowstreamProvider";

export function FlowstreamToolbar() {
  const { isRunning, setIsRunning } = useFlowstream();

  return (
    <div className="h-12 border-b bg-background px-4 flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isRunning ? 'Stop' : 'Run'}
      </Button>

      <Button variant="outline" size="sm">
        <Save className="h-4 w-4 mr-2" />
        Save
      </Button>

      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>

      <Button variant="outline" size="sm">
        <Upload className="h-4 w-4 mr-2" />
        Import
      </Button>

      <Button variant="outline" size="sm">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
    </div>
  );
}
