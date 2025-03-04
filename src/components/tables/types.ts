
import { Json } from '@/integrations/supabase/types';

export interface Column {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date';
  width?: number;
}

export interface CustomTable {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  columns: any[];
  data: any[][];
  category?: string | null;
}

export interface TableData {
  id: string;
  name: string;
  columns: Column[];
  data: any[][];
  cell_status?: boolean[][];
}

export interface TableEditorProps {
  tableId: string;
}

export interface ActiveCell {
  row: number;
  col: number;
}
