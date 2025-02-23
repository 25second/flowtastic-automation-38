
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

    if (selection) {
      const startRow = Math.min(selection.start.row, selection.end.row);
      const endRow = Math.max(selection.start.row, selection.end.row);
      const startCol = Math.min(selection.start.col, selection.end.col);
      const endCol = Math.max(selection.start.col, selection.end.col);

      const selectedData = table.data
        .slice(startRow, endRow + 1)
        .map(row => row.slice(startCol, endCol + 1));

      navigator.clipboard.writeText(
        selectedData.map(row => row.join('\t')).join('\n')
      );
      toast.success('Copied to clipboard');
    } else if (activeCell) {
      const value = table.data[activeCell.row][activeCell.col];
      navigator.clipboard.writeText(value?.toString() || '');
      toast.success('Copied to clipboard');
    }
  }, [table, selection, activeCell]);

  const handlePaste = useCallback(async () => {
    if (!table || !activeCell) return;

    try {
      const text = await navigator.clipboard.readText();
      const rows = text.split('\n').map(row => row.split('\t'));

      const newData = [...table.data];
      rows.forEach((row, rowOffset) => {
        row.forEach((value, colOffset) => {
          const targetRow = activeCell.row + rowOffset;
          const targetCol = activeCell.col + colOffset;

          if (targetRow < newData.length && targetCol < table.columns.length) {
            newData[targetRow][targetCol] = value;
          }
        });
      });

      const { error } = await supabase
        .from('custom_tables')
        .update({ data: newData as unknown as Json })
        .eq('id', tableId);

      if (error) throw error;

      return newData;
    } catch (error) {
      toast.error('Failed to paste data');
      return null;
    }
  }, [table, activeCell, tableId]);

  return {
    handleCopy,
    handlePaste
  };
};
