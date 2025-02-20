
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskNameInputProps {
  taskName: string;
  taskColor: string;
  onNameChange: (value: string) => void;
  onColorChange: (value: string) => void;
}

export function TaskNameInput({ taskName, taskColor, onNameChange, onColorChange }: TaskNameInputProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="taskName">Task Name</Label>
        <Input
          id="taskName"
          value={taskName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter task name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="taskColor">Task Color</Label>
        <Input
          id="taskColor"
          type="color"
          value={taskColor}
          onChange={(e) => onColorChange(e.target.value)}
        />
      </div>
    </div>
  );
}
