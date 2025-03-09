import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { iconOptions } from './icon-options';
import { colorOptions } from './color-options';

interface IconColorSelectorProps {
  selectedIcon: string;
  selectedColor: string;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
}

export function IconColorSelector({
  selectedIcon,
  selectedColor,
  onIconChange,
  onColorChange
}: IconColorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = iconOptions.find(option => option.name === selectedIcon)?.component || iconOptions[0].component;

  const handleIconSelect = (iconName: string) => {
    onIconChange(iconName);
    // Keep popover open after selection
  };

  const handleColorSelect = (colorValue: string) => {
    onColorChange(colorValue);
    // Keep popover open after selection
  };

  return (
    <div className="inline-block">
      <TooltipProvider>
        <Tooltip>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 w-10 p-0"
                  style={{ backgroundColor: selectedColor }}
                  type="button"
                >
                  <IconComponent className="h-5 w-5 text-white" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            
            <TooltipContent>
              <p>Select icon and color</p>
            </TooltipContent>
            
            <PopoverContent 
              className="w-80" 
              align="start"
              onInteractOutside={(e) => {
                // This prevents the popover from closing when clicking inside
                e.preventDefault();
              }}
            >
              <div className="space-y-4 select-none">
                <div>
                  <Label>Icon</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {iconOptions.map((icon) => {
                      const Icon = icon.component;
                      return (
                        <Button
                          key={icon.name}
                          variant="outline"
                          className={`h-10 w-10 p-0 ${selectedIcon === icon.name ? 'border-2 border-primary' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIconSelect(icon.name);
                          }}
                          type="button"
                        >
                          <Icon className="h-5 w-5 pointer-events-none" />
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <Label>Color</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <Button
                        key={color.name}
                        variant="outline"
                        className={`h-10 w-10 p-0 ${selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleColorSelect(color.value);
                        }}
                        type="button"
                      >
                        {selectedColor === color.value && (
                          <Check className="h-4 w-4 text-white pointer-events-none" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
