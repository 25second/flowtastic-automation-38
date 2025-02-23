
import React from 'react';
import { EditableCell } from './EditableCell';
import { TableData } from './types';
import { MIN_COLUMN_WIDTH } from './hooks/useTableState';

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
  onCellMouseUp
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
    <div className="overflow-auto">
      <table className="w-full border-collapse" style={{ minWidth: `${minTableWidth}px` }}>
        <thead>
          <tr>
            <th className="sticky left-0 top-0 bg-gradient-to-br from-[#9b87f5] to-[#8B5CF6] text-white px-4 py-2 text-left text-sm font-semibold border-b border-purple-300 w-16 z-20 shadow-lg">
              №
            </th>
            {table.columns.map((column) => (
              <th
                key={column.id}
                className="sticky top-0 bg-gradient-to-br from-purple-100 to-white px-4 py-2 text-left text-sm font-semibold border-b border-purple-200 select-none hover:bg-purple-50 transition-colors duration-200"
                style={{ width: Math.max(column.width || MIN_COLUMN_WIDTH, MIN_COLUMN_WIDTH) }}
                onClick={() => onColumnHeaderClick(column.id, column.name)}
              >
                <div className="text-xs text-purple-600 mb-1 opacity-75 break-all">ID: {column.id}</div>
                {editingColumnId === column.id ? (
                  <input
                    autoFocus
                    value={editingColumnName}
                    onChange={(e) => onEditValueChange(e)}
                    onBlur={onColumnNameChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onColumnNameChange();
                      }
                    }}
                    className="w-full p-1 border rounded focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex items-center justify-between group">
                    <span className="font-medium text-gray-700">{column.name}</span>
                    <div
                      className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-purple-400 transition-colors group-hover:bg-purple-300"
                      onMouseDown={(e) => onResizeStart(column.id, e)}
                    />
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-purple-50/50 transition-colors duration-200">
              <td className="sticky left-0 border-b border-purple-100 px-4 py-2 text-sm text-purple-600 bg-purple-50/80 backdrop-blur-sm w-16 z-10 font-medium">
                {rowIndex + 1}
              </td>
              {row.map((cell, colIndex) => (
                <EditableCell
                  key={`${rowIndex}-${colIndex}`}
                  value={cell}
                  isEditing={activeCell?.row === rowIndex && activeCell?.col === colIndex}
                  isSelected={isCellSelected(rowIndex, colIndex)}
                  editValue={editValue}
                  onValueChange={onEditValueChange}
                  onBlur={onCellChange}
                  onClick={(e: React.MouseEvent) => onCellClick(rowIndex, colIndex, cell, e.shiftKey)}
                  onMouseDown={() => onCellMouseDown(rowIndex, colIndex, cell)}
                  onMouseOver={() => onCellMouseOver(rowIndex, colIndex)}
                  onMouseUp={onCellMouseUp}
                  style={{ width: Math.max(table.columns[colIndex]?.width || MIN_COLUMN_WIDTH, MIN_COLUMN_WIDTH) }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
