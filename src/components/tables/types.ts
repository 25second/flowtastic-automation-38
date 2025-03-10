
export interface TableColumn {
  id: string;
  name: string;
  type: string;
  width?: number;
  options?: string[];
}

export interface CustomTable {
  id: string;
  name: string;
  description?: string;
  columns: TableColumn[];
  data: any[][];
  created_at: string;
  updated_at: string;
  category?: string;
  is_favorite?: boolean;
  tags?: string[] | string;
}

export interface TableData {
  id: string;
  name: string;
  columns: Column[];
  data: any[][];
  cell_status?: boolean[][];
}

export interface Column {
  id: string;
  name: string;
  type: string;
  width?: number;
}

export interface ActiveCell {
  row: number;
  col: number;
}
