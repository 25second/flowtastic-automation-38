
import { toast } from 'sonner';
import { TableData } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export const useRowOperations = (
  tableId: string, 
  table: TableData | null, 
  setTable: (table: TableData | null) => void
) => {
  const addRow = async (index?: number) => {
    if (!table) return;
    
    const newRow = new Array(table.columns.length).fill('');
    const newData = [...table.data];
    
    if (typeof index === 'number') {
      newData.splice(index, 0, newRow);
    } else {
      newData.push(newRow);
    }

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({ data: newData as unknown as Json })
        .eq('id', tableId);

      if (error) throw error;

      setTable({ ...table, data: newData });
      toast.success('Строка добавлена');
    } catch (error) {
      toast.error('Не удалось добавить строку');
    }
  };

  const deleteRow = async (index: number) => {
    if (!table || index < 0 || index >= table.data.length) return;

    const newData = [...table.data];
    newData.splice(index, 1);

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({ data: newData as unknown as Json })
        .eq('id', tableId);

      if (error) throw error;

      setTable({ ...table, data: newData });
      toast.success('Строка удалена');
    } catch (error) {
      toast.error('Не удалось удалить строку');
    }
  };

  return {
    addRow,
    deleteRow
  };
};
