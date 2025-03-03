
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TableFilter {
  column: string;
  value: any;
  operator?: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
}

export interface TableRequestOptions {
  tableId?: string;
  tableName?: string;
  columns?: string[];
  filter?: TableFilter[];
  limit?: number;
  offset?: number;
}

export interface TableCreateOptions {
  tableName: string;
  description?: string;
  columns?: Array<{
    id: string;
    name: string;
    type: 'text' | 'number' | 'date';
    width?: number;
  }>;
  data?: any[][];
}

// Получение списка всех таблиц
export const getAllTables = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('table-api/get-tables');
    
    if (error) {
      console.error('Error fetching tables:', error);
      toast.error('Не удалось получить список таблиц');
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAllTables:', error);
    toast.error('Ошибка при получении таблиц');
    throw error;
  }
};

// Получение данных таблицы по ID или имени
export const getTableData = async (options: TableRequestOptions) => {
  try {
    const { data, error } = await supabase.functions.invoke('table-api/get-table', {
      body: options
    });
    
    if (error) {
      console.error('Error fetching table data:', error);
      toast.error('Не удалось получить данные таблицы');
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getTableData:', error);
    toast.error('Ошибка при получении данных таблицы');
    throw error;
  }
};

// Запись данных в таблицу
export const writeTableData = async (options: { tableId?: string; tableName?: string; data: any[][] }) => {
  try {
    const { data, error } = await supabase.functions.invoke('table-api/write-table', {
      body: options
    });
    
    if (error) {
      console.error('Error writing table data:', error);
      toast.error('Не удалось записать данные в таблицу');
      throw error;
    }
    
    toast.success('Данные успешно записаны');
    return data;
  } catch (error) {
    console.error('Error in writeTableData:', error);
    toast.error('Ошибка при записи данных в таблицу');
    throw error;
  }
};

// Создание новой таблицы
export const createTable = async (options: TableCreateOptions) => {
  try {
    const { data, error } = await supabase.functions.invoke('table-api/create-table', {
      body: options
    });
    
    if (error) {
      console.error('Error creating table:', error);
      toast.error('Не удалось создать таблицу');
      throw error;
    }
    
    toast.success('Таблица успешно создана');
    return data;
  } catch (error) {
    console.error('Error in createTable:', error);
    toast.error('Ошибка при создании таблицы');
    throw error;
  }
};

// Удаление таблицы
export const deleteTable = async (options: { tableId?: string; tableName?: string }) => {
  try {
    const { data, error } = await supabase.functions.invoke('table-api/delete-table', {
      body: options
    });
    
    if (error) {
      console.error('Error deleting table:', error);
      toast.error('Не удалось удалить таблицу');
      throw error;
    }
    
    toast.success('Таблица успешно удалена');
    return data;
  } catch (error) {
    console.error('Error in deleteTable:', error);
    toast.error('Ошибка при удалении таблицы');
    throw error;
  }
};
