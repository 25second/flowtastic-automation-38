
import { useState, useEffect } from 'react';
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
      console.log('Loading table data for ID:', tableId); // Добавляем лог для отладки

      const { data, error } = await supabase
        .from('custom_tables')
        .select('*')
        .eq('id', tableId)
        .single();

      if (error) {
        console.error('Supabase error:', error); // Добавляем лог ошибки
        throw error;
      }

      if (!data) {
        console.error('No data found for table ID:', tableId); // Добавляем лог отсутствия данных
        throw new Error('Table not found');
      }

      console.log('Received data:', data); // Добавляем лог полученных данных

      const columns = Array.isArray(data.columns) 
        ? data.columns.map((col: any): Column => ({
            id: col.id || crypto.randomUUID(),
            name: col.name || '',
            type: col.type || 'text',
            width: col.width
          }))
        : [];

      const parsedData: TableData = {
        id: data.id,
        name: data.name,
        columns: columns,
        data: Array.isArray(data.data) ? data.data : [],
        cell_status: Array.isArray(data.cell_status) ? data.cell_status : []
      };

      console.log('Parsed table data:', parsedData); // Добавляем лог обработанных данных
      setTableData(parsedData);
    } catch (error) {
      console.error('Error loading table:', error);
      toast.error('Ошибка при загрузке таблицы');
    } finally {
      setLoading(false);
    }
  };

  // Добавляем useEffect для автоматической загрузки данных при монтировании компонента
  useEffect(() => {
    if (tableId) {
      loadTableData();
    }
  }, [tableId]);

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
