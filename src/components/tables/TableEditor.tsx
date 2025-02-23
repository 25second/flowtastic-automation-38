
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableHeader } from './TableHeader';
import { TableContent } from './TableContent';
import { TableEditorProps } from './types';
import { useTableState } from './hooks/useTableState';
import { BackButton } from '@/components/flow/BackButton';

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
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-lg font-medium text-purple-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-lg font-medium text-red-500">Table not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-white to-purple-50">
      <div className="bg-gradient-to-r from-purple-100 to-transparent">
        <BackButton />
      </div>
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
