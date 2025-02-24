import { toast } from 'sonner';
import { TableData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { columnsToJson } from '../utils';
import * as XLSX from 'xlsx';

export const useTableOperations = (tableId: string, table: TableData | null, setTable: (table: TableData | null) => void) => {
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
    addRow,
    addColumn,
    deleteRow,
    deleteColumn,
    exportTable,
    importTable
  };
};
