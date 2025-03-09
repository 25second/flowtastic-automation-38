
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface IconColorSelectorProps {
  selectedColor: string;
}

export function IconColorSelector({
  selectedColor
}: IconColorSelectorProps) {
  return (
    <div className="inline-flex items-center justify-center">
      <div 
        className="h-10 w-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: selectedColor }}
      >
        <Bot className="h-5 w-5 text-white" />
      </div>
    </div>
  );
}
