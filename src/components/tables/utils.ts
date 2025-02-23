
import { Json } from '@/integrations/supabase/types';
import { Column } from './types';

export function parseTableData(rawData: any) {
  return {
    id: rawData.id,
    name: rawData.name,
    description: rawData.description,
    columns: Array.isArray(rawData.columns) ? rawData.columns : [],
    data: Array.isArray(rawData.data) ? rawData.data : [],
    created_at: rawData.created_at,
    updated_at: rawData.updated_at,
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
