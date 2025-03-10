
import React from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import "handsontable/dist/handsontable.full.min.css";
import { TableData } from './types';

// Register Handsontable modules
registerAllModules();

interface TableEditorContentProps {
  tableData: TableData;
  onDataChange: (changes: any) => void;
}

export function TableEditorContent({ tableData, onDataChange }: TableEditorContentProps) {
  const hotSettings = {
    data: tableData.data,
    colHeaders: tableData.columns.map(col => col.name),
    rowHeaders: true,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation',
    stretchH: 'all' as const,
    contextMenu: true,
    manualColumnResize: true,
    manualRowResize: true,
    allowInsertRow: true,
    allowInsertColumn: true,
    allowRemoveRow: true,
    allowRemoveColumn: true,
    afterChange: (changes: any) => {
      if (changes) {
        onDataChange(changes);
      }
    }
  };

  return (
    <div className="flex-1 w-full overflow-auto">
      <HotTable settings={hotSettings} />
    </div>
  );
}
