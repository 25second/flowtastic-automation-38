
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAllModules } from 'handsontable/registry';
import "handsontable/dist/handsontable.full.min.css";
import { TableData } from './types';
import { useTableOperations } from './hooks/useTableOperations';
import { useTableModifications } from './hooks/useTableModifications';
import { useContextMenuOperations } from './hooks/useContextMenuOperations';
import { TableToolbar } from './TableToolbar';
import { TableContent } from './TableContent';
import { createTableSettings } from './config/tableSettings';

// Register Handsontable modules
registerAllModules();

interface TableEditorProps {
  tableId: string;
}

export function TableEditor({ tableId }: TableEditorProps) {
  const navigate = useNavigate();
  const hotTableRef = useRef<any>(null);
  const [selectedCells, setSelectedCells] = useState<{
    start: { row: number; col: number };
    end: { row: number; col: number };
  } | null>(null);

  const { tableData, setTableData, loading, loadTableData, handleSave } = useTableOperations(tableId);
  const { handleAddRow, handleAddColumn, exportToCsv, exportToXlsx, importFile } = useTableModifications(tableData, setTableData);
  const contextMenuOperations = useContextMenuOperations(hotTableRef, selectedCells);

  useEffect(() => {
    loadTableData();
  }, [tableId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  if (!tableData) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-destructive">Таблица не найдена</div>
      </div>
    );
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFile(file);
    }
  };

  const hotSettings = createTableSettings(tableData, setTableData, setSelectedCells);

  return (
    <div className="flex flex-col h-screen bg-background">
      <TableToolbar
        tableName={tableData.name}
        onNavigateBack={() => navigate('/tables')}
        onAddRow={handleAddRow}
        onAddColumn={handleAddColumn}
        onExportCsv={exportToCsv}
        onExportXlsx={exportToXlsx}
        onImport={handleImport}
        onSave={handleSave}
      />

      <div className="flex-1 overflow-hidden">
        <TableContent
          hotTableRef={hotTableRef}
          settings={hotSettings}
          contextMenuOperations={contextMenuOperations}
        />
      </div>
    </div>
  );
}
