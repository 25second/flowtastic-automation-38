
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
  const getSelectionRange = () => {
    if (!selection) return null;
    
    const startRow = Math.min(selection.start.row, selection.end.row);
    const endRow = Math.max(selection.start.row, selection.end.row);
    const startCol = Math.min(selection.start.col, selection.end.col);
    const endCol = Math.max(selection.start.col, selection.end.col);
    
    return { startRow, endRow, startCol, endCol };
  };

  const handleCopy = useCallback(() => {
    if (!table) {
      console.log('No table data available');
      return;
    }

    try {
      if (selection) {
        const range = getSelectionRange();
        if (!range) return;
        
        const { startRow, endRow, startCol, endCol } = range;
        console.log('Copying range:', range);

        const selectedData = table.data
          .slice(startRow, endRow + 1)
          .map(row => row.slice(startCol, endCol + 1));

        console.log('Selected data:', selectedData);
        const textData = selectedData.map(row => row.join('\t')).join('\n');
        
        navigator.clipboard.writeText(textData).then(() => {
          toast.success('Скопировано');
          console.log('Copy successful');
        });
      } else if (activeCell) {
        const value = table.data[activeCell.row][activeCell.col];
        navigator.clipboard.writeText(String(value ?? ''));
        toast.success('Скопировано');
      }
    } catch (error) {
      console.error('Copy operation error:', error);
      toast.error('Ошибка при копировании');
    }
  }, [table, selection, activeCell]);

  const handlePaste = useCallback(async () => {
    if (!table) return null;

    try {
      const text = await navigator.clipboard.readText();
      const pastedRows = text.split('\n').map(row => row.split('\t'));
      
      const newData = [...table.data];
      
      if (selection) {
        const range = getSelectionRange();
        if (!range) return null;
        
        const { startRow, endRow, startCol, endCol } = range;
        const selectionHeight = endRow - startRow + 1;
        const selectionWidth = endCol - startCol + 1;
        
        // Повторяем данные, если выделение больше, чем вставляемые данные
        for (let i = 0; i < selectionHeight; i++) {
          for (let j = 0; j < selectionWidth; j++) {
            const row = startRow + i;
            const col = startCol + j;
            if (row >= newData.length || col >= table.columns.length) continue;
            
            const pastedValue = pastedRows[i % pastedRows.length][j % pastedRows[0].length];
            if (pastedValue !== undefined) {
              newData[row][col] = pastedValue;
            }
          }
        }
      } else if (activeCell) {
        const startRow = activeCell.row;
        const startCol = activeCell.col;
        
        for (let i = 0; i < pastedRows.length; i++) {
          const row = startRow + i;
          if (row >= newData.length) continue;
          
          for (let j = 0; j < pastedRows[i].length; j++) {
            const col = startCol + j;
            if (col >= table.columns.length) continue;
            newData[row][col] = pastedRows[i][j];
          }
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
      console.error('Paste operation error:', error);
      toast.error('Ошибка при вставке');
      return null;
    }
  }, [table, selection, activeCell, tableId]);

  const handleClear = useCallback(async () => {
    if (!table) return null;

    try {
      const newData = [...table.data];

      if (selection) {
        const range = getSelectionRange();
        if (!range) return null;
        
        const { startRow, endRow, startCol, endCol } = range;
        
        for (let i = startRow; i <= endRow; i++) {
          for (let j = startCol; j <= endCol; j++) {
            if (i < newData.length && j < table.columns.length) {
              newData[i][j] = '';
            }
          }
        }
      } else if (activeCell) {
        newData[activeCell.row][activeCell.col] = '';
      }

      const { error } = await supabase
        .from('custom_tables')
        .update({ data: newData as Json })
        .eq('id', tableId);

      if (error) throw error;

      toast.success('Очищено');
      return newData;
    } catch (error) {
      console.error('Clear operation error:', error);
      toast.error('Ошибка при очистке');
      return null;
    }
  }, [table, selection, activeCell, tableId]);

  return {
    handleCopy,
    handlePaste,
    handleClear
  };
};
