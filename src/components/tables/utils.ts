
import { Json } from '@/integrations/supabase/types';
import { Column, TableData } from './types';

export function parseTableData(rawData: any): TableData {
  return {
    id: rawData.id,
    name: rawData.name,
    columns: Array.isArray(rawData.columns) ? rawData.columns : [],
    data: Array.isArray(rawData.data) ? rawData.data : []
  };
}

export function columnsToJson(columns: Column[]): Json {
  return columns.map(column => ({
    ...column,
    id: column.id,
    name: column.name,
    type: column.type
  })) as unknown as Json;
}
