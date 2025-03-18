
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TaskNameFieldProps {
  taskName: string;
  setTaskName: (name: string) => void;
}

export function TaskNameField({ taskName, setTaskName }: TaskNameFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="taskName">Task Name</Label>
      <Input
        id="taskName"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter a name for this task"
      />
    </div>
  );
}
