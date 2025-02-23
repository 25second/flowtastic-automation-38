
import { useCallback } from 'react';
import { toast } from 'sonner';
import { TableData, ActiveCell } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export const useClipboard = (
  table: TableData | null,
  activeCell: ActiveCell | null,
  selection: { start: ActiveCell; end: ActiveCell } | null,
  tableId: string
) => {
  const handleCopy = useCallback(() => {
    if (!table) return;

    try {
      if (selection) {
        const startRow = Math.min(selection.start.row, selection.end.row);
        const endRow = Math.max(selection.start.row, selection.end.row);
        const startCol = Math.min(selection.start.col, selection.end.col);
        const endCol = Math.max(selection.start.col, selection.end.col);

        const selectedData = [];
        for (let i = startRow; i <= endRow; i++) {
          const rowData = [];
          for (let j = startCol; j <= endCol; j++) {
            rowData.push(table.data[i][j]);
          }
          selectedData.push(rowData);
        }

        const textData = selectedData.map(row => row.join('\t')).join('\n');
        navigator.clipboard.writeText(textData);
        toast.success('Скопировано');
      } else if (activeCell) {
        const value = table.data[activeCell.row][activeCell.col];
        navigator.clipboard.writeText(String(value ?? ''));
        toast.success('Скопировано');
      }
    } catch (error) {
      toast.error('Ошибка при копировании');
    }
  }, [table, selection, activeCell]);

  const handlePaste = useCallback(async () => {
    if (!table || (!activeCell && !selection)) return null;

    try {
      const text = await navigator.clipboard.readText();
      const pastedRows = text.split('\n').map(row => row.split('\t'));

      const startRow = selection?.start.row ?? activeCell!.row;
      const startCol = selection?.start.col ?? activeCell!.col;

      const newData = [...table.data];
      
      for (let i = 0; i < pastedRows.length; i++) {
        const row = startRow + i;
        if (row >= newData.length) continue;

        for (let j = 0; j < pastedRows[i].length; j++) {
          const col = startCol + j;
          if (col >= table.columns.length) continue;

          newData[row][col] = pastedRows[i][j];
        }
      }

      const { error } = await supabase
        .from('custom_tables')
        .update({ data: newData as Json })
        .eq('id', tableId);

      if (error) throw error;

      toast.success('Вставлено');
      return newData;
    } catch (error) {
      toast.error('Ошибка при вставке');
      return null;
    }
  }, [table, activeCell, selection, tableId]);

  return {
    handleCopy,
    handlePaste
  };
};
