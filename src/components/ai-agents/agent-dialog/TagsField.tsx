
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TagsFieldProps {
  tags: string;
  setTags: (value: string) => void;
}

export function TagsField({ tags, setTags }: TagsFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="tags" className="text-sm font-medium">Tags (comma-separated)</Label>
      <Input
        id="tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="monitoring, scraping, etc."
        className="border border-input focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
