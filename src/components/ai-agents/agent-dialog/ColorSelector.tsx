
import { Label } from '@/components/ui/label';
import { accentColors } from '@/constants/accentColors';

interface ColorSelectorProps {
  selectedColor: string;
  setSelectedColor: (value: string) => void;
}

export function ColorSelector({ 
  selectedColor, 
  setSelectedColor 
}: ColorSelectorProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">Agent Color</Label>
      <div className="grid grid-cols-8 gap-2 mt-1">
        {accentColors.map((color) => (
          <button
            key={color.value}
            type="button"
            className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
              selectedColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => setSelectedColor(color.value)}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
