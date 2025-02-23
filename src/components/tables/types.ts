
import { Json } from '@/integrations/supabase/types';

export interface TableEditorProps {
  tableId: string;
}

export interface Column {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date';
}

export interface TableData {
  id: string;
  name: string;
  columns: Column[];
  data: any[][];
}

export interface ActiveCell {
  row: number;
  col: number;
}
