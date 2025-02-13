
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CanvasHeaderProps {
  isEditing: boolean;
  onBack: () => void;
}

export const CanvasHeader = ({ isEditing, onBack }: CanvasHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEditing ? "Edit Canvas" : "New Canvas"}
        </h1>
      </div>
    </div>
  );
};
