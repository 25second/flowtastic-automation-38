
import { Button } from "@/components/ui/button";
import { PlayIcon, FileUpIcon, SaveIcon, VideoIcon, EyeIcon } from "lucide-react";

interface TopActionsProps {
  existingWorkflow?: {
    id: string;
    name: string;
  };
  handleStartWorkflow: () => void;
  handleImportClick: () => void;
  handleSave: () => void;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  setShowScript: (value: boolean) => void;
}

export const TopActions = ({
  existingWorkflow,
  handleStartWorkflow,
  handleImportClick,
  handleSave,
  isRecording,
  setIsRecording,
  setShowScript
}: TopActionsProps) => {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
      {existingWorkflow && (
        <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-zinc-200 shadow-sm">
          <span className="text-sm font-medium text-zinc-700">
            {existingWorkflow.name}
          </span>
        </div>
      )}

      <Button onClick={handleStartWorkflow} className="flex items-center gap-2 bg-gradient-to-br from-[#9b87f5] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 animate-fade-in group">
        <PlayIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
        <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
          Start Workflow
        </span>
      </Button>

      <div className="flex items-center gap-3 animate-fade-in">
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={handleImportClick}
          className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg"
        >
          <FileUpIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
        </Button>

        <Button variant="secondary" size="icon" onClick={handleSave} className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg">
          <SaveIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
        </Button>

        <Button variant="secondary" size="icon" onClick={() => setIsRecording(!isRecording)} className={`hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg ${isRecording ? "text-red-500 animate-pulse" : ""}`}>
          <VideoIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
        </Button>

        <Button variant="secondary" size="icon" onClick={() => setShowScript(true)} className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg">
          <EyeIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
        </Button>
      </div>
    </div>
  );
};
