
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
