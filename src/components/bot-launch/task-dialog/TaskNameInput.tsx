
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskNameInputProps {
  taskName: string;
  taskColor: string;
  onNameChange: (value: string) => void;
  onColorChange: (value: string) => void;
}

const TASK_COLORS = [
  '#8B5CF6', // Vivid Purple
  '#D946EF', // Magenta Pink
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#F2FCE2', // Soft Green
  '#FEF7CD', // Soft Yellow
  '#FEC6A1', // Soft Orange
  '#E5DEFF', // Soft Purple
  '#FFDEE2', // Soft Pink
  '#FDE1D3', // Soft Peach
  '#D3E4FD', // Soft Blue
  '#8E9196', // Neutral Gray
];

export function TaskNameInput({ taskName, taskColor, onNameChange, onColorChange }: TaskNameInputProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-4 space-y-2">
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
        <Select value={taskColor} onValueChange={onColorChange}>
          <SelectTrigger id="taskColor" className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: taskColor }}
                />
                <span className="sr-only">Selected color</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <div className="grid grid-cols-4 gap-1 p-1">
              {TASK_COLORS.map((color) => (
                <SelectItem
                  key={color}
                  value={color}
                  className="px-2 py-1 rounded-md cursor-pointer hover:bg-accent"
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
