
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableHeader } from './TableHeader';
import { TableContent } from './TableContent';
import { TableEditorProps } from './types';
import { useTableState } from './hooks/useTableState';

export function TableEditor({ tableId }: TableEditorProps) {
  const {
    table,
    loading,
    activeCell,
    editValue,
    editingColumnId,
    editingColumnName,
    setEditValue,
    handleCellClick,
    handleColumnHeaderClick,
    handleColumnNameChange,
    handleCellChange,
    handleResizeStart,
    addRow,
    addColumn,
    exportTable,
    importTable
  } = useTableState(tableId);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!table) {
    return <div className="p-8">Table not found</div>;
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <TableHeader
        tableName={table.name}
        onAddColumn={addColumn}
        onAddRow={addRow}
        onExport={exportTable}
        onImport={importTable}
      />
      <ScrollArea className="flex-1 w-full h-full">
        <div className="w-full relative min-w-max">
          <TableContent
            table={table}
            activeCell={activeCell}
            editValue={editValue}
            editingColumnId={editingColumnId}
            editingColumnName={editingColumnName}
            onEditValueChange={(e) => setEditValue(e.target.value)}
            onCellChange={handleCellChange}
            onCellClick={handleCellClick}
            onColumnHeaderClick={handleColumnHeaderClick}
            onColumnNameChange={handleColumnNameChange}
            onResizeStart={handleResizeStart}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
