
import { toast } from 'sonner';
import { TableData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { columnsToJson } from '../utils';
import * as XLSX from 'xlsx';

export const useTableOperations = (tableId: string) => {
  const addRow = async (table: TableData) => {
    const newRow = new Array(table.columns.length).fill('');
    const newData = [...table.data, newRow];

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({ data: newData as unknown as Json })
        .eq('id', tableId);

      if (error) throw error;

      return { ...table, data: newData };
    } catch (error) {
      toast.error('Failed to add row');
      return null;
    }
  };

  const addColumn = async (table: TableData) => {
    const newColumn = {
      id: crypto.randomUUID(),
      name: `Column ${table.columns.length + 1}`,
      type: 'text' as const
    };

    const newColumns = [...table.columns, newColumn];
    const newData = table.data.map(row => [...row, '']);

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({
          columns: columnsToJson(newColumns),
          data: newData as unknown as Json
        })
        .eq('id', tableId);

      if (error) throw error;

      return { ...table, columns: newColumns, data: newData };
    } catch (error) {
      toast.error('Failed to add column');
      return null;
    }
  };

  const exportTable = (table: TableData, format: 'csv' | 'xlsx' | 'numbers') => {
    try {
      const headers = table.columns.map(col => col.name);
      const exportData = [headers, ...table.data];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const fileName = `${table.name}_${new Date().toISOString().split('T')[0]}`;

      switch (format) {
        case 'csv':
          XLSX.writeFile(wb, `${fileName}.csv`);
          break;
        case 'xlsx':
          XLSX.writeFile(wb, `${fileName}.xlsx`);
          break;
        case 'numbers':
          XLSX.writeFile(wb, `${fileName}.numbers`);
          break;
      }

      toast.success(`Table exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export table');
    }
  };

  const importTable = async (file: File, table: TableData) => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          if (jsonData.length < 2) {
            toast.error('File contains no data');
            reject('No data');
            return;
          }

          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1);

          const newColumns = headers.map((header, index) => ({
            id: table?.columns[index]?.id || crypto.randomUUID(),
            name: header,
            type: 'text' as const
          }));

          try {
            const { error } = await supabase
              .from('custom_tables')
              .update({
                columns: columnsToJson(newColumns),
                data: rows as unknown as Json
              })
              .eq('id', tableId);

            if (error) throw error;

            resolve({ ...table, columns: newColumns, data: rows });
          } catch (error) {
            toast.error('Failed to update table data');
            reject(error);
          }
        };

        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      toast.error('Failed to import file');
      return null;
    }
  };

  return {
    addRow,
    addColumn,
    exportTable,
    importTable
  };
};
