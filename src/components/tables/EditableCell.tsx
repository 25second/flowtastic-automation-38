
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EditableCellProps {
  value: any;
  isEditing: boolean;
  isSelected?: boolean;
  isRead?: boolean;
  editValue: string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onClick: (e: React.MouseEvent) => void;
  onMouseDown: () => void;
  onMouseOver: () => void;
  onMouseUp: () => void;
  style?: React.CSSProperties;
}

export function EditableCell({ 
  value, 
  isEditing, 
  isSelected,
  isRead,
  editValue, 
  onValueChange, 
  onBlur, 
  onClick,
  onMouseDown,
  onMouseOver,
  onMouseUp,
  style 
}: EditableCellProps) {
  return (
    <td
      className={cn(
        "relative border-b border-r border-border px-4 py-2 text-sm transition-colors select-none group-hover:bg-muted/50",
        isSelected && "bg-primary/10 border border-primary/30",
        isRead && "bg-secondary/20",
        !isEditing && "truncate"
      )}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      style={style}
    >
      {isEditing ? (
        <Input
          autoFocus
          value={editValue}
          onChange={onValueChange}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onBlur();
            }
          }}
          className="absolute inset-0 p-1 h-full border-0 focus-visible:ring-2 focus-visible:ring-primary bg-background"
        />
      ) : (
        <span className="block truncate">{value}</span>
      )}
    </td>
  );
}
