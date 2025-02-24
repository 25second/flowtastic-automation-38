
import { toast } from 'sonner';
import { TableData } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { columnsToJson } from '../../utils';

export const useColumnOperations = (
  tableId: string, 
  table: TableData | null, 
  setTable: (table: TableData | null) => void
) => {
  const addColumn = async (index?: number) => {
    if (!table) return;
    
    const newColumn = {
      id: crypto.randomUUID(),
      name: `Столбец ${table.columns.length + 1}`,
      type: 'text' as const
    };

    const newColumns = [...table.columns];
    const newData = table.data.map(row => {
      const newRow = [...row];
      if (typeof index === 'number') {
        newRow.splice(index, 0, '');
      } else {
        newRow.push('');
      }
      return newRow;
    });

    if (typeof index === 'number') {
      newColumns.splice(index, 0, newColumn);
    } else {
      newColumns.push(newColumn);
    }

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({
          columns: columnsToJson(newColumns),
          data: newData as unknown as Json
        })
        .eq('id', tableId);

      if (error) throw error;

      setTable({ ...table, columns: newColumns, data: newData });
      toast.success('Столбец добавлен');
    } catch (error) {
      toast.error('Не удалось добавить столбец');
    }
  };

  const deleteColumn = async (index: number) => {
    if (!table || index < 0 || index >= table.columns.length) return;

    const newColumns = [...table.columns];
    newColumns.splice(index, 1);

    const newData = table.data.map(row => {
      const newRow = [...row];
      newRow.splice(index, 1);
      return newRow;
    });

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({
          columns: columnsToJson(newColumns),
          data: newData as unknown as Json
        })
        .eq('id', tableId);

      if (error) throw error;

      setTable({ ...table, columns: newColumns, data: newData });
      toast.success('Столбец удален');
    } catch (error) {
      toast.error('Не удалось удалить столбец');
    }
  };

  return {
    addColumn,
    deleteColumn
  };
};
