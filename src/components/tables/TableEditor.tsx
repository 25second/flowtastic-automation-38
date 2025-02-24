
import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TableHeader } from './TableHeader';
import { TableContent } from './TableContent';
import { TableEditorProps } from './types';
import { useTableState } from './hooks/useTableState';
import { BackButton } from '@/components/flow/BackButton';
import { useAccentColor } from '@/hooks/useAccentColor';
import { useTableOperations } from './hooks/useTableOperations';

export function TableEditor({ tableId }: TableEditorProps) {
  useAccentColor();
  
  const {
    table,
    setTable, // Add setTable from useTableState
    loading,
    activeCell,
    editValue,
    editingColumnId,
    editingColumnName,
    selection,
    setEditValue,
    handleCellClick,
    handleCellMouseDown,
    handleCellMouseOver,
    handleCellMouseUp,
    handleColumnHeaderClick,
    handleColumnNameChange,
    handleCellChange,
    handleResizeStart,
    handleCopy,
    handlePaste,
    handleClear,
  } = useTableState(tableId);

  const {
    addRow,
    addColumn,
    deleteRow,
    deleteColumn,
    exportTable,
    importTable
  } = useTableOperations(tableId, table, setTable);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-lg font-medium text-purple-600 animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-lg font-medium text-red-500">Таблица не найдена</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-background to-muted/50">
      <div className="bg-gradient-to-r from-muted/50 to-transparent">
        <BackButton />
      </div>
      <TableHeader
        tableName={table.name}
        onAddColumn={() => addColumn()}
        onAddRow={() => addRow()}
        onExport={exportTable}
        onImport={importTable}
      />
      <div className="flex-1 w-full h-full relative overflow-hidden">
        <ScrollArea className="h-[calc(100vh-8rem)] w-full">
          <div className="min-w-max">
            <TableContent
              table={table}
              activeCell={activeCell}
              editValue={editValue}
              editingColumnId={editingColumnId}
              editingColumnName={editingColumnName}
              selection={selection}
              onEditValueChange={(e) => setEditValue(e.target.value)}
              onCellChange={handleCellChange}
              onCellClick={handleCellClick}
              onColumnHeaderClick={handleColumnHeaderClick}
              onColumnNameChange={handleColumnNameChange}
              onResizeStart={handleResizeStart}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseOver={handleCellMouseOver}
              onCellMouseUp={handleCellMouseUp}
              onCopy={handleCopy}
              onPaste={handlePaste}
              onClear={handleClear}
              onAddColumn={addColumn}
              onDeleteColumn={deleteColumn}
              onAddRow={addRow}
              onDeleteRow={deleteRow}
            />
          </div>
          <ScrollBar orientation="horizontal" />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}
