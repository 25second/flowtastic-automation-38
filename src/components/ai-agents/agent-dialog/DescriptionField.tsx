
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DescriptionFieldProps {
  description: string;
  setDescription: (value: string) => void;
}

export function DescriptionField({ description, setDescription }: DescriptionFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="description" className="text-sm font-medium">Description</Label>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what this agent does"
        className="min-h-[50px] border border-input resize-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
