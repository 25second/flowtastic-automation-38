
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

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
    <div className="space-y-2 relative">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <Label htmlFor="task-description" className="font-medium">Task Description</Label>
      </div>
      
      <div className="relative">
        <Textarea
          id="task-description"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe what you want the AI agent to do..."
          className="min-h-[100px] bg-background/80 border-primary/20 focus-visible:border-primary/50 focus-visible:ring-primary/20 rounded-lg shadow-sm"
        />
        
        <div className="absolute inset-0 pointer-events-none rounded-lg" 
             style={{
               background: 'linear-gradient(135deg, rgba(155, 135, 245, 0.04) 0%, rgba(155, 135, 245, 0.01) 100%)',
               zIndex: -1
             }}>
        </div>
      </div>
      
      <div className="bg-muted/30 p-3 rounded-lg border border-primary/10 mt-2">
        <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
          <Sparkles className="h-3 w-3 mr-1 text-primary/70" />
          Examples (click to use):
        </p>
        <ul className="grid gap-1.5">
          {exampleTasks.map((task, index) => (
            <li 
              key={index} 
              className="text-xs cursor-pointer hover:text-primary transition-colors flex items-center gap-1.5 bg-background/80 py-1.5 px-2.5 rounded-md border border-primary/5"
              onClick={() => onChange(task)}
            >
              <span className="w-4 h-4 flex items-center justify-center bg-primary/10 text-primary rounded-full text-[9px] font-medium">
                {index + 1}
              </span>
              {task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
