
import React from 'react';
import { X, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isElectronApp, minimizeWindow, closeWindow } from '@/electron';

export function WindowControls() {
  if (!isElectronApp()) return null;
  
  return (
    <div className="flex items-center ml-auto">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full hover:bg-secondary"
        onClick={minimizeWindow}
        aria-label="Minimize"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full hover:bg-destructive hover:text-destructive-foreground"
        onClick={closeWindow}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
