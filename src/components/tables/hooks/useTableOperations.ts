
import { TableData } from '../types';
import { useRowOperations } from './operations/useRowOperations';
import { useColumnOperations } from './operations/useColumnOperations';
import { useTableImportExport } from './operations/useTableImportExport';

export const useTableOperations = (
  tableId: string, 
  table: TableData | null, 
  setTable: (table: TableData | null) => void
) => {
  const { addRow, deleteRow } = useRowOperations(tableId, table, setTable);
  const { addColumn, deleteColumn } = useColumnOperations(tableId, table, setTable);
  const { exportTable, importTable } = useTableImportExport(tableId, table, setTable);

  return {
    addRow,
    addColumn,
    deleteRow,
    deleteColumn,
    exportTable,
    importTable
  };
};
