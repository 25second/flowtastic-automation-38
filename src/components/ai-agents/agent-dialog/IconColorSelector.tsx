
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface IconColorSelectorProps {
  selectedColor: string;
}

export function IconColorSelector({
  selectedColor
}: IconColorSelectorProps) {
  return (
    <div className="inline-block">
      <Button
        variant="outline"
        className="h-10 w-10 p-0"
        style={{ backgroundColor: selectedColor }}
        type="button"
        disabled
      >
        <Bot className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
