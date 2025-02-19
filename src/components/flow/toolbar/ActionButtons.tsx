
import { Button } from "@/components/ui/button";
import { PlayIcon, SparklesIcon, SaveIcon, VideoIcon, EyeIcon } from "lucide-react";
import { FlowState } from "@/components/flow/WorkflowStateProvider";
import { toast } from "sonner";

interface ActionButtonsProps {
  onStartWorkflow: () => void;
  onSave: (flowState: FlowState) => void;
  onRecord: () => void;
  onShowScript: () => void;
  isRecording: boolean;
  flowState: FlowState;
}

export const ActionButtons = ({
  onStartWorkflow,
  onSave,
  onRecord,
  onShowScript,
  isRecording,
  flowState
}: ActionButtonsProps) => {
  const handleCreateWithAI = () => {
    toast.info("AI workflow creation coming soon!");
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
      <Button
        onClick={onStartWorkflow}
        className="flex items-center gap-2 bg-gradient-to-br from-[#9b87f5] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 animate-fade-in group"
      >
        <PlayIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
        <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
          Start Workflow
        </span>
      </Button>

      <Button
        onClick={handleCreateWithAI}
        className="flex items-center gap-2 bg-gradient-to-br from-[#F97316] to-[#FEC6A1] hover:from-[#EA580C] hover:to-[#FB923C] text-white shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 animate-fade-in group"
      >
        <SparklesIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
        <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
          Create with AI
        </span>
      </Button>

      <div className="flex items-center gap-3 animate-fade-in">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onSave(flowState)}
          className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg"
        >
          <SaveIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={onRecord}
          className={`hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg ${isRecording ? "text-red-500 animate-pulse" : ""}`}
        >
          <VideoIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={onShowScript}
          className="hover:scale-110 transition-transform duration-200 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 shadow-md hover:shadow-lg"
        >
          <EyeIcon className="h-4 w-4 hover:rotate-12 transition-transform duration-200" />
        </Button>
      </div>
    </div>
  );
};
