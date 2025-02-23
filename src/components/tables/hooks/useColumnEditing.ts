
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TableData } from '../types';
import { columnsToJson } from '../utils';

export const useColumnEditing = (tableId: string, table: TableData | null, setTable: (table: TableData | null) => void) => {
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnName, setEditingColumnName] = useState('');
  const [resizing, setResizing] = useState<{ columnId: string; startX: number } | null>(null);

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

  const handleResizeStart = (columnId: string, e: React.MouseEvent) => {
    setResizing({
      columnId,
      startX: e.pageX
    });
  };

  return {
    editingColumnId,
    editingColumnName,
    setEditingColumnName,
    resizing,
    setResizing,
    handleColumnHeaderClick,
    handleColumnNameChange,
    handleResizeStart
  };
};
