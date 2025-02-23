
import { useEffect } from 'react';
import { useTableLoading } from './useTableLoading';
import { useTableSelection } from './useTableSelection';
import { useColumnEditing } from './useColumnEditing';
import { useCellEditing } from './useCellEditing';
import { useClipboard } from './useClipboard';
import { useTableOperations } from './useTableOperations';

export { MIN_COLUMN_WIDTH } from './constants';

export const useTableState = (tableId: string) => {
  const { table, setTable, loading } = useTableLoading(tableId);
  
  const {
    activeCell,
    setActiveCell,
    selection,
    setSelection,
    handleCellMouseDown,
    handleCellMouseOver,
    handleCellMouseUp,
    handleCellClick
  } = useTableSelection();

  const {
    editingColumnId,
    editingColumnName,
    setEditingColumnName,
    handleColumnHeaderClick,
    handleColumnNameChange,
    handleResizeStart
  } = useColumnEditing(tableId, table, setTable);

  const {
    editValue,
    setEditValue,
    handleCellChange
  } = useCellEditing(tableId, table, setTable);

  const { handleCopy, handlePaste } = useClipboard(table, activeCell, selection, tableId);
  const { addRow, addColumn, exportTable, importTable } = useTableOperations(tableId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!table || (!activeCell && !selection)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        console.log('Copy shortcut detected');
        e.preventDefault();
        handleCopy();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        console.log('Paste shortcut detected');
        e.preventDefault();
        handlePaste().then((newData) => {
          if (newData) {
            setTable(prevTable => prevTable ? { ...prevTable, data: newData } : null);
          }
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [table, activeCell, selection, handleCopy, handlePaste]);

  return {
    table,
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
    addRow,
    addColumn,
    exportTable,
    importTable
  };
};
