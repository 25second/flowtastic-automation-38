
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
        "border px-4 py-2 text-sm transition-colors select-none relative",
        isSelected && "bg-purple-100/50 border-2 border-purple-500/50",
        isRead && "bg-purple-50"
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
          className="p-0 h-6 border-0 focus-visible:ring-0"
        />
      ) : (
        value
      )}
    </td>
  );
}
