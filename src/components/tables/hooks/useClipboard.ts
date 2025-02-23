
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
    if (!table) {
      console.log('No table data available');
      return;
    }

    try {
      if (selection) {
        console.log('Selection found:', selection);
        
        const startRow = Math.min(selection.start.row, selection.end.row);
        const endRow = Math.max(selection.start.row, selection.end.row);
        const startCol = Math.min(selection.start.col, selection.end.col);
        const endCol = Math.max(selection.start.col, selection.end.col);

        console.log('Copying range:', { startRow, endRow, startCol, endCol });

        // Use slice for better array handling
        const selectedData = table.data
          .slice(startRow, endRow + 1)
          .map(row => row.slice(startCol, endCol + 1));

        console.log('Selected data:', selectedData);

        const textData = selectedData.map(row => row.join('\t')).join('\n');
        console.log('Text to copy:', textData);

        navigator.clipboard.writeText(textData).then(() => {
          toast.success('Скопировано');
          console.log('Copy successful');
        }).catch((error) => {
          console.error('Copy failed:', error);
          toast.error('Ошибка при копировании');
        });
      } else if (activeCell) {
        console.log('Copying single cell:', activeCell);
        const value = table.data[activeCell.row][activeCell.col];
        navigator.clipboard.writeText(String(value ?? '')).then(() => {
          toast.success('Скопировано');
          console.log('Single cell copy successful');
        }).catch((error) => {
          console.error('Single cell copy failed:', error);
          toast.error('Ошибка при копировании');
        });
      } else {
        console.log('No selection or active cell');
      }
    } catch (error) {
      console.error('Copy operation error:', error);
      toast.error('Ошибка при копировании');
    }
  }, [table, selection, activeCell]);

  const handlePaste = useCallback(async () => {
    if (!table || (!activeCell && !selection)) {
      console.log('No table or paste target');
      return null;
    }

    try {
      console.log('Starting paste operation');
      const text = await navigator.clipboard.readText();
      console.log('Clipboard content:', text);

      const pastedRows = text.split('\n').map(row => row.split('\t'));
      console.log('Parsed rows:', pastedRows);

      const startRow = selection?.start.row ?? activeCell!.row;
      const startCol = selection?.start.col ?? activeCell!.col;
      console.log('Paste start position:', { startRow, startCol });

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

      console.log('Updated data:', newData);

      const { error } = await supabase
        .from('custom_tables')
        .update({ data: newData as Json })
        .eq('id', tableId);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      toast.success('Вставлено');
      return newData;
    } catch (error) {
      console.error('Paste operation error:', error);
      toast.error('Ошибка при вставке');
      return null;
    }
  }, [table, activeCell, selection, tableId]);

  return {
    handleCopy,
    handlePaste
  };
};
