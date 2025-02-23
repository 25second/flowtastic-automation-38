
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
  onEditValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCellChange: () => void;
  onCellClick: (row: number, col: number, value: any) => void;
  onColumnHeaderClick: (columnId: string, columnName: string) => void;
  onColumnNameChange: () => void;
  onResizeStart: (columnId: string, e: React.MouseEvent) => void;
}

export function TableContent({
  table,
  activeCell,
  editValue,
  editingColumnId,
  editingColumnName,
  onEditValueChange,
  onCellChange,
  onCellClick,
  onColumnHeaderClick,
  onColumnNameChange,
  onResizeStart
}: TableContentProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="sticky left-0 top-0 bg-gray-100 px-4 py-2 text-left text-sm font-semibold border w-16 z-20">
            №
          </th>
          {table.columns.map((column) => (
            <th
              key={column.id}
              className="sticky top-0 bg-gray-100 px-4 py-2 text-left text-sm font-semibold border select-none"
              style={{ width: column.width || MIN_COLUMN_WIDTH }}
              onClick={() => onColumnHeaderClick(column.id, column.name)}
            >
              <div className="text-xs text-gray-500 mb-1">ID: {column.id}</div>
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
                  className="w-full p-1 border rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span>{column.name}</span>
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 transition-colors"
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
          <tr key={rowIndex}>
            <td className="sticky left-0 border px-4 py-2 text-sm text-gray-500 bg-gray-50 w-16 z-10">
              {rowIndex + 1}
            </td>
            {row.map((cell, colIndex) => (
              <EditableCell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                isEditing={activeCell?.row === rowIndex && activeCell?.col === colIndex}
                editValue={editValue}
                onValueChange={onEditValueChange}
                onBlur={onCellChange}
                onClick={() => onCellClick(rowIndex, colIndex, cell)}
                style={{ width: table.columns[colIndex]?.width || MIN_COLUMN_WIDTH }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
