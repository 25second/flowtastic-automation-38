
import { toast } from 'sonner';
import { TableData } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import * as XLSX from 'xlsx';
import { columnsToJson } from '../../utils';

export const useTableImportExport = (
  tableId: string, 
  table: TableData | null, 
  setTable: (table: TableData | null) => void
) => {
  const exportTable = async (format: 'csv' | 'xlsx' | 'numbers') => {
    if (!table) return;
    
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

      toast.success(`Таблица экспортирована как ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Не удалось экспортировать таблицу');
    }
  };

  const importTable = async (file: File) => {
    if (!table) return;
    
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
            toast.error('Файл содержит no данных');
            reject('Нет данных');
            return;
          }

          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1);

          const newColumns = headers.map((header, index) => ({
            id: table.columns[index]?.id || crypto.randomUUID(),
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

            const updatedTable = { ...table, columns: newColumns, data: rows };
            setTable(updatedTable);
            resolve(updatedTable);
            toast.success('Таблица импортирована успешно');
          } catch (error) {
            toast.error('Не удалось обновить данные таблицы');
            reject(error);
          }
        };

        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      toast.error('Не удалось импортировать файл');
      return null;
    }
  };

  return {
    exportTable,
    importTable
  };
};
