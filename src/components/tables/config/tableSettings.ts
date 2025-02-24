
import type { HotTableProps } from '@handsontable/react';
import { TableData } from '../types';

export const createTableSettings = (
  tableData: TableData,
  setTableData: (data: TableData) => void,
  setSelectedCells: (cells: { start: { row: number; col: number }; end: { row: number; col: number } } | null) => void
): Partial<HotTableProps['settings']> => ({
  // Основные настройки
  data: tableData.data,
  colHeaders: tableData.columns.map(col => col.name),
  rowHeaders: true,
  height: '100%',
  licenseKey: 'non-commercial-and-evaluation',
  stretchH: 'all',
  
  // Включаем все основные функции
  contextMenu: true,
  manualColumnResize: true,
  manualRowResize: true,
  allowInsertRow: true,
  allowInsertColumn: true,
  allowRemoveRow: true,
  allowRemoveColumn: true,
  dropdownMenu: true,
  filters: true,
  multiColumnSorting: true,
  columnSorting: true,
  search: true,
  comments: true,
  
  // Настройки редактирования
  readOnly: false,
  editor: true,
  copyPaste: true,
  fillHandle: true,
  mergeCells: true,
  
  // Настройки ячеек
  cells(row: number, col: number) {
    return {
      className: 'htMiddle',
      type: tableData.columns[col]?.type || 'text'
    };
  },
  
  // Настройки стилей
  className: 'htDarkTheme',
  headerClassName: 'htCenter htMiddle',
  currentRowClassName: 'hot-current-row',
  currentColClassName: 'hot-current-col',
  currentHeaderClassName: 'hot-current-header',
  rowHeights: 25,
  colWidths: 100,
  
  // Настройки навигации
  enterBeginsEditing: true,
  enterMoves: { row: 1, col: 0 },
  tabMoves: { row: 0, col: 1 },
  
  // Обработка событий
  afterSelection: (row: number, column: number, row2: number, column2: number) => {
    setSelectedCells({
      start: { row: Math.min(row, row2), col: Math.min(column, column2) },
      end: { row: Math.max(row, row2), col: Math.max(column, column2) },
    });
  },
  
  afterChange: (changes: any) => {
    if (changes) {
      setTableData({
        ...tableData,
        data: tableData.data.map((row, rowIndex) => 
          row.map((cell, colIndex) => {
            const change = changes.find(
              ([changeRow, changeCol]: [number, number]) => 
              changeRow === rowIndex && changeCol === colIndex
            );
            return change ? change[3] : cell;
          })
        )
      });
    }
  }
});
