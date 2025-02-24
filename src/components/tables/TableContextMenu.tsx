
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Scissors, Plus, Trash2 } from 'lucide-react';

interface TableContextMenuProps {
  children: React.ReactNode;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDeleteCells: () => void;
  onInsertRowAbove: () => void;
  onInsertRowBelow: () => void;
  onRemoveRow: () => void;
  onInsertColLeft: () => void;
  onInsertColRight: () => void;
  onRemoveCol: () => void;
}

export const TableContextMenu: React.FC<TableContextMenuProps> = ({
  children,
  onCopy,
  onCut,
  onPaste,
  onDeleteCells,
  onInsertRowAbove,
  onInsertRowBelow,
  onRemoveRow,
  onInsertColLeft,
  onInsertColRight,
  onRemoveCol,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex-1">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={onCopy} className="gap-2">
          <Copy className="h-4 w-4" /> Копировать
        </ContextMenuItem>
        <ContextMenuItem onClick={onCut} className="gap-2">
          <Scissors className="h-4 w-4" /> Вырезать
        </ContextMenuItem>
        <ContextMenuItem onClick={onPaste} className="gap-2">
          <Plus className="h-4 w-4" /> Вставить
        </ContextMenuItem>
        <ContextMenuItem onClick={onDeleteCells} className="gap-2">
          <Trash2 className="h-4 w-4" /> Очистить ячейки
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onInsertRowAbove} className="gap-2">
          <Plus className="h-4 w-4" /> Вставить строку выше
        </ContextMenuItem>
        <ContextMenuItem onClick={onInsertRowBelow} className="gap-2">
          <Plus className="h-4 w-4" /> Вставить строку ниже
        </ContextMenuItem>
        <ContextMenuItem onClick={onRemoveRow} className="gap-2 text-destructive">
          <Trash2 className="h-4 w-4" /> Удалить строку
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onInsertColLeft} className="gap-2">
          <Plus className="h-4 w-4" /> Вставить столбец слева
        </ContextMenuItem>
        <ContextMenuItem onClick={onInsertColRight} className="gap-2">
          <Plus className="h-4 w-4" /> Вставить столбец справа
        </ContextMenuItem>
        <ContextMenuItem onClick={onRemoveCol} className="gap-2 text-destructive">
          <Trash2 className="h-4 w-4" /> Удалить столбец
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
