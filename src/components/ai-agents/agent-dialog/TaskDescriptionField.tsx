
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TaskDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

// Example task descriptions for inspiration
const exampleTasks = [
  "Monitor website for price changes and notify me",
  "Extract product information from a list of URLs",
  "Generate weekly reports from data in selected table",
  "Track competitor website changes"
];

export function TaskDescriptionField({ value, onChange }: TaskDescriptionFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="task-description">Task Description</Label>
      <Textarea
        id="task-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the task this agent will perform"
        className="min-h-[60px]"
      />
      <div className="text-sm text-muted-foreground mt-1">
        <p className="mb-1">Examples:</p>
        <ul className="list-disc pl-5 space-y-0.5">
          {exampleTasks.map((task, index) => (
            <li 
              key={index} 
              className="text-xs cursor-pointer hover:text-primary" 
              onClick={() => onChange(task)}
            >
              {task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
