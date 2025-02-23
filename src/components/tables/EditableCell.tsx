
import React from 'react';
import { Input } from '@/components/ui/input';

interface EditableCellProps {
  value: any;
  isEditing: boolean;
  editValue: string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function EditableCell({ 
  value, 
  isEditing, 
  editValue, 
  onValueChange, 
  onBlur, 
  onClick,
  style 
}: EditableCellProps) {
  return (
    <td
      className="border px-4 py-2 text-sm"
      onClick={onClick}
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
