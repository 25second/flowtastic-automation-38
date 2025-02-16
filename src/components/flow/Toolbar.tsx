
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Browser } from "@/types/workflow";
import { EyeIcon, PlayIcon, SaveIcon, SparklesIcon, VideoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  browsers: Browser[];
  selectedBrowser: Browser | null;
  onBrowserSelect: (browserId: string) => void;
  onStartWorkflow: () => void;
  onCreateWithAI: () => void;
  onSave: () => void;
  isRecording: boolean;
  onRecordClick: () => void;
  onViewScript: () => void;
}

export const Toolbar = ({
  browsers,
  selectedBrowser,
  onBrowserSelect,
  onStartWorkflow,
  onCreateWithAI,
  onSave,
  isRecording,
  onRecordClick,
  onViewScript
}: ToolbarProps) => {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
      <Select
        value={selectedBrowser?.id}
        onValueChange={onBrowserSelect}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select browser" />
        </SelectTrigger>
        <SelectContent>
          {browsers.map((browser) => (
            <SelectItem key={browser.id} value={browser.id}>
              {browser.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="secondary"
        size="icon"
        onClick={onStartWorkflow}
      >
        <PlayIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        onClick={onCreateWithAI}
      >
        <SparklesIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        onClick={onSave}
      >
        <SaveIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        onClick={onRecordClick}
        className={cn(isRecording && "text-red-500")}
      >
        <VideoIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        onClick={onViewScript}
      >
        <EyeIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
