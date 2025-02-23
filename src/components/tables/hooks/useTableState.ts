import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TableData, ActiveCell } from '../types';
import { parseTableData, columnsToJson } from '../utils';
import { useClipboard } from './useClipboard';
import { useTableOperations } from './useTableOperations';
import { MIN_COLUMN_WIDTH } from './constants';
import { Json } from '@/integrations/supabase/types';

export { MIN_COLUMN_WIDTH } from './constants';

export const useTableState = (tableId: string) => {
  const [table, setTable] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnName, setEditingColumnName] = useState('');
  const [resizing, setResizing] = useState<{ columnId: string; startX: number } | null>(null);
  const [selection, setSelection] = useState<{ start: ActiveCell; end: ActiveCell } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const { handleCopy, handlePaste } = useClipboard(table, activeCell, selection, tableId);
  const { addRow: addRowOp, addColumn: addColumnOp, exportTable, importTable } = useTableOperations(tableId);

  const loadTable = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_tables')
        .select('*')
        .eq('id', tableId)
        .single();

      if (error) throw error;

      setTable(parseTableData(data));
    } catch (error) {
      toast.error('Failed to load table');
    } finally {
      setLoading(false);
    }
  };

  const handleCellMouseDown = (row: number, col: number, value: any) => {
    setIsSelecting(true);
    setActiveCell({ row, col });
    setEditValue(value?.toString() || '');
    setSelection({ start: { row, col }, end: { row, col } });
  };

  const handleCellMouseOver = (row: number, col: number) => {
    if (isSelecting && selection) {
      setSelection(prev => ({
        start: prev!.start,
        end: { row, col }
      }));
    }
  };

  const handleCellMouseUp = () => {
    setIsSelecting(false);
  };

  const handleCellClick = (row: number, col: number, value: any, isShiftKey: boolean = false) => {
    if (isShiftKey && activeCell) {
      setSelection({
        start: activeCell,
        end: { row, col }
      });
    } else if (!isSelecting) {
      setActiveCell({ row, col });
      setEditValue(value?.toString() || '');
      setSelection(null);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsSelecting(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleColumnHeaderClick = (columnId: string, columnName: string) => {
    setEditingColumnId(columnId);
    setEditingColumnName(columnName);
  };

  const handleColumnNameChange = async () => {
    if (!editingColumnId || !table) return;

    const newColumns = table.columns.map(col => 
      col.id === editingColumnId 
        ? { ...col, name: editingColumnName }
        : col
    );

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({ columns: columnsToJson(newColumns) })
        .eq('id', tableId);

      if (error) throw error;

      setTable({ ...table, columns: newColumns });
      setEditingColumnId(null);
      toast.success('Column name updated');
    } catch (error) {
      toast.error('Failed to update column name');
    }
  };

  const handleCellChange = async () => {
    if (!activeCell || !table) return;

    const newData = [...table.data];
    newData[activeCell.row][activeCell.col] = editValue;

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({ data: newData as Json })
        .eq('id', tableId);

      if (error) throw error;

      setTable({ ...table, data: newData });
      setActiveCell(null);
      toast.success('Cell updated');
    } catch (error) {
      toast.error('Failed to update cell');
    }
  };

  const handleResizeStart = (columnId: string, e: React.MouseEvent) => {
    setResizing({
      columnId,
      startX: e.pageX
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (resizing && table) {
        const diff = e.pageX - resizing.startX;
        const newColumns = table.columns.map(col => {
          if (col.id === resizing.columnId) {
            const newWidth = (col.width || MIN_COLUMN_WIDTH) + diff;
            return {
              ...col,
              width: Math.max(MIN_COLUMN_WIDTH, newWidth)
            };
          }
          return col;
        });

        setTable(prev => prev ? { ...prev, columns: newColumns } : null);
      }
    };

    const handleMouseUp = async () => {
      if (table) {
        try {
          const { error } = await supabase
            .from('custom_tables')
            .update({ columns: columnsToJson(table.columns) })
            .eq('id', tableId);

          if (error) throw error;
        } catch (error) {
          toast.error('Failed to save column widths');
        }
      }
      setResizing(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const addRow = async () => {
    if (!table) return;
    const newTable = await addRowOp(table);
    if (newTable) setTable(newTable);
  };

  const addColumn = async () => {
    if (!table) return;
    const newTable = await addColumnOp(table);
    if (newTable) setTable(newTable);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        handleCopy();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        handlePaste().then((newData: any[][] | null) => {
          if (newData && table) {
            setTable((prevTable: TableData | null) => {
              if (!prevTable) return null;
              return { ...prevTable, data: newData };
            });
          }
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleCopy, handlePaste, table]);

  useEffect(() => {
    loadTable();
  }, [tableId]);

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
    exportTable: (format: 'csv' | 'xlsx' | 'numbers') => table && exportTable(table, format),
    importTable: (file: File) => {
      if (!table) return;
      
      return importTable(file, table).then((newTable: TableData | null) => {
        if (newTable) {
          setTable((prevTable: TableData | null) => {
            if (!prevTable) return null;
            return newTable;
          });
        }
      });
    }
  };
};
