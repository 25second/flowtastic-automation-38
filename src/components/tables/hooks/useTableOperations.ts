
import { useState } from 'react';
import { TableData, Column } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export const useTableOperations = (tableId: string) => {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTableData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_tables')
        .select('*')
        .eq('id', tableId)
        .single();

      if (error) throw error;

      const columns = Array.isArray(data.columns) 
        ? data.columns.map((col: any): Column => ({
            id: col.id || '',
            name: col.name || '',
            type: col.type || 'text',
            width: col.width
          }))
        : [];

      const parsedData: TableData = {
        id: data.id,
        name: data.name,
        columns: columns,
        data: data.data as any[][],
        cell_status: data.cell_status as boolean[][]
      };

      setTableData(parsedData);
    } catch (error) {
      console.error('Error loading table:', error);
      toast.error('Ошибка при загрузке таблицы');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tableData) return;

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({
          data: tableData.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', tableId);

      if (error) throw error;

      toast.success('Таблица сохранена');
    } catch (error) {
      console.error('Error saving table:', error);
      toast.error('Ошибка при сохранении таблицы');
    }
  };

  return {
    tableData,
    setTableData,
    loading,
    loadTableData,
    handleSave,
  };
};
