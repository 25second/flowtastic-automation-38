
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TableData } from '../types';

export function useTableEditor(tableId: string) {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tableId) {
      console.log("TableEditor mounted with tableId:", tableId);
      loadTableData();
    } else {
      console.error("No tableId provided");
      toast.error('Идентификатор таблицы не указан');
      setLoading(false);
    }
  }, [tableId]);

  const loadTableData = async () => {
    try {
      setLoading(true);
      console.log("Loading table data for ID:", tableId);
      
      // First, try to get the table by ID
      const { data, error } = await supabase
        .from('custom_tables')
        .select('*')
        .eq('id', tableId)
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!data) {
        console.error("No data returned for table ID:", tableId);
        toast.error('Таблица не найдена');
        setLoading(false);
        return;
      }

      console.log("Received table data:", data);

      const columns = Array.isArray(data.columns) 
        ? data.columns.map((col: any) => ({
            id: col.id || '',
            name: col.name || '',
            type: col.type || 'text',
            width: col.width
          }))
        : [];

      // Safe conversion of JSON data to proper format
      let tableRows: any[][] = [];
      if (Array.isArray(data.data)) {
        tableRows = data.data as any[][];
      }

      // Safe conversion of cell_status
      let cellStatus: boolean[][] = [];
      if (Array.isArray(data.cell_status)) {
        cellStatus = data.cell_status as boolean[][];
      }

      const parsedData: TableData = {
        id: data.id,
        name: data.name,
        columns: columns,
        data: tableRows,
        cell_status: cellStatus
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
    if (!tableData || !tableId) return;

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

  const updateTableData = (newData: any[][]) => {
    if (!tableData) return;
    setTableData({
      ...tableData,
      data: newData
    });
  };

  return {
    tableData,
    loading,
    setTableData,
    handleSave,
    updateTableData
  };
}
