
import React from 'react';
import { EditableCell } from './EditableCell';
import { TableData } from './types';
import { MIN_COLUMN_WIDTH } from './hooks/useTableState';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Copy, ClipboardPaste, Trash2, Plus, ArrowUpDown } from "lucide-react";

interface TableContentProps {
  table: TableData;
  activeCell: { row: number; col: number } | null;
  editValue: string;
  editingColumnId: string | null;
  editingColumnName: string;
  selection: { start: { row: number; col: number }; end: { row: number; col: number } } | null;
  onEditValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCellChange: () => void;
  onCellClick: (row: number, col: number, value: any, isShiftKey: boolean) => void;
  onColumnHeaderClick: (columnId: string, columnName: string) => void;
  onColumnNameChange: () => void;
  onResizeStart: (columnId: string, e: React.MouseEvent) => void;
  onCellMouseDown: (row: number, col: number, value: any) => void;
  onCellMouseOver: (row: number, col: number) => void;
  onCellMouseUp: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onClear: () => void;
  onAddColumn: (index?: number) => void;
  onDeleteColumn: (index: number) => void;
  onAddRow: (index?: number) => void;
  onDeleteRow: (index: number) => void;
}

export function TableContent({
  table,
  activeCell,
  editValue,
  editingColumnId,
  editingColumnName,
  selection,
  onEditValueChange,
  onCellChange,
  onCellClick,
  onColumnHeaderClick,
  onColumnNameChange,
  onResizeStart,
  onCellMouseDown,
  onCellMouseOver,
  onCellMouseUp,
  onCopy,
  onPaste,
  onClear,
  onAddColumn,
  onDeleteColumn,
  onAddRow,
  onDeleteRow
}: TableContentProps) {
  const minTableWidth = (table.columns.length * MIN_COLUMN_WIDTH) + 64;

  const isCellSelected = (rowIndex: number, colIndex: number) => {
    if (!selection) return false;
    
    const startRow = Math.min(selection.start.row, selection.end.row);
    const endRow = Math.max(selection.start.row, selection.end.row);
    const startCol = Math.min(selection.start.col, selection.end.col);
    const endCol = Math.max(selection.start.col, selection.end.col);

    return rowIndex >= startRow && rowIndex <= endRow && 
           colIndex >= startCol && colIndex <= endCol;
  };

  return (
    <div className="relative overflow-auto border rounded-lg">
      <table className="w-full border-collapse bg-background" style={{ minWidth: `${minTableWidth}px` }}>
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-30 bg-muted border-b border-r border-border px-4 py-2 text-left text-sm font-medium text-muted-foreground w-16">
              №
            </th>
            {table.columns.map((column, columnIndex) => (
              <ContextMenu key={column.id}>
                <ContextMenuTrigger>
                  <th
                    className="sticky top-0 z-20 bg-muted border-b border-r border-border px-4 py-2 text-left text-sm font-medium text-muted-foreground"
                    style={{ 
                      width: Math.max(column.width || MIN_COLUMN_WIDTH, MIN_COLUMN_WIDTH),
                      minWidth: MIN_COLUMN_WIDTH
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground/60 truncate">
                        ID: {column.id}
                      </div>
                      {editingColumnId === column.id ? (
                        <input
                          autoFocus
                          value={editingColumnName}
                          onChange={onEditValueChange}
                          onBlur={onColumnNameChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onColumnNameChange();
                            }
                          }}
                          className="w-full p-1 border rounded focus:ring-2 focus:ring-ring focus:border-ring outline-none bg-background text-foreground"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="flex items-center justify-between group relative">
                          <span 
                            className="font-medium text-foreground cursor-pointer hover:text-primary truncate pr-4"
                            onClick={() => onColumnHeaderClick(column.id, column.name)}
                          >
                            {column.name}
                          </span>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors"
                            onMouseDown={(e) => onResizeStart(column.id, e)}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => onAddColumn(columnIndex)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Вставить столбец слева
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => onAddColumn(columnIndex + 1)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Вставить столбец справа
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => onDeleteColumn(columnIndex)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить столбец
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.data.map((row, rowIndex) => (
            <ContextMenu key={rowIndex}>
              <ContextMenuTrigger>
                <tr className="group">
                  <td className="sticky left-0 z-10 bg-muted/50 backdrop-blur border-b border-r border-border px-4 py-2 text-sm font-medium text-muted-foreground w-16 group-hover:bg-muted">
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, colIndex) => (
                    <EditableCell
                      key={`${rowIndex}-${colIndex}`}
                      value={cell}
                      isEditing={activeCell?.row === rowIndex && activeCell?.col === colIndex}
                      isSelected={isCellSelected(rowIndex, colIndex)}
                      isRead={table.cell_status?.[rowIndex]?.[colIndex] || false}
                      editValue={editValue}
                      onValueChange={onEditValueChange}
                      onBlur={onCellChange}
                      onClick={(e: React.MouseEvent) => onCellClick(rowIndex, colIndex, cell, e.shiftKey)}
                      onMouseDown={() => onCellMouseDown(rowIndex, colIndex, cell)}
                      onMouseOver={() => onCellMouseOver(rowIndex, colIndex)}
                      onMouseUp={onCellMouseUp}
                      style={{ 
                        width: Math.max(table.columns[colIndex]?.width || MIN_COLUMN_WIDTH, MIN_COLUMN_WIDTH),
                        minWidth: MIN_COLUMN_WIDTH
                      }}
                    />
                  ))}
                </tr>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => onAddRow(rowIndex)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Вставить строку выше
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onAddRow(rowIndex + 1)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Вставить строку ниже
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => onDeleteRow(rowIndex)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить строку
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </tbody>
      </table>
    </div>
  );
}
