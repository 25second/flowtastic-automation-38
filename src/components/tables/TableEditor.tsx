
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTableEditor } from './hooks/useTableEditor';
import { useTableFileOperations } from './hooks/useTableFileOperations';
import { TableEditorToolbar } from './TableEditorToolbar';
import { TableEditorContent } from './TableEditorContent';
import { TableEditorLoading } from './TableEditorLoading';

interface TableEditorProps {
  tableId: string;
}

export function TableEditor({ tableId: propTableId }: TableEditorProps) {
  const params = useParams();
  const tableId = propTableId || params.tableId; // Get tableId from props or URL params
  
  const {
    tableData,
    loading,
    setTableData,
    handleSave,
    updateTableData
  } = useTableEditor(tableId || '');

  const {
    exportToExcel,
    exportToCSV,
    importFile
  } = useTableFileOperations(tableData, setTableData);

  const handleTableDataChange = (changes: any) => {
    if (changes && tableData) {
      const newData = [...tableData.data];
      changes.forEach(([row, col, oldValue, newValue]: [number, number, any, any]) => {
        if (row < newData.length) {
          if (!newData[row]) newData[row] = [];
          newData[row][col] = newValue;
        }
      });
      updateTableData(newData);
    }
  };

  if (loading) {
    return <TableEditorLoading />;
  }

  if (!tableData) {
    return <TableEditorLoading message="Таблица не найдена" />;
  }

  return (
    <div className="flex flex-col h-screen">
      <TableEditorToolbar 
        tableName={tableData.name}
        onSave={handleSave}
        onImport={importFile}
        onExportExcel={exportToExcel}
        onExportCSV={exportToCSV}
      />
      <TableEditorContent 
        tableData={tableData} 
        onDataChange={handleTableDataChange} 
      />
    </div>
  );
}
