
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot } from 'lucide-react';

interface NameFieldProps {
  name: string;
  setName: (value: string) => void;
  selectedColor: string;
}

export function NameField({ name, setName, selectedColor }: NameFieldProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-md flex items-center justify-center bg-primary/10">
        <div 
          className="h-10 w-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: selectedColor }}
        >
          <Bot className="h-5 w-5 text-white" />
        </div>
      </div>
      
      <div className="flex-1">
        <Label htmlFor="agent-name" className="text-sm font-medium mb-1 block">Agent Name</Label>
        <Input
          id="agent-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter agent name"
          className="border border-input bg-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}
