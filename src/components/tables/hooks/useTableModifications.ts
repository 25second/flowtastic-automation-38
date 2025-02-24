
import { TableData, Column } from '../types';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export const useTableModifications = (
  tableData: TableData | null,
  setTableData: (data: TableData | null) => void
) => {
  const handleAddRow = () => {
    if (!tableData) return;
    const newData = [...tableData.data, Array(tableData.columns.length).fill('')];
    setTableData({ ...tableData, data: newData });
    toast.success('Строка добавлена');
  };

  const handleAddColumn = () => {
    if (!tableData) return;
    const newColumnId = Date.now().toString();
    const newColumn: Column = {
      id: newColumnId,
      name: `Колонка ${tableData.columns.length + 1}`,
      type: 'text',
    };
    
    const newColumns = [...tableData.columns, newColumn];
    const newData = tableData.data.map(row => [...row, '']);
    
    setTableData({
      ...tableData,
      columns: newColumns,
      data: newData,
    });
    toast.success('Колонка добавлена');
  };

  const exportToCsv = () => {
    if (!tableData) return;
    
    const csvContent = [
      tableData.columns.map(col => col.name).join(','),
      ...tableData.data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${tableData.name}.csv`;
    link.click();
    toast.success('Таблица экспортирована в CSV');
  };

  const exportToXlsx = () => {
    if (!tableData) return;

    const ws = XLSX.utils.aoa_to_sheet([
      tableData.columns.map(col => col.name),
      ...tableData.data
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${tableData.name}.xlsx`);
    toast.success('Таблица экспортирована в XLSX');
  };

  const importFile = async (file: File) => {
    if (!tableData) return;
    
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      let data: any[][] = [];
      
      if (fileExt === 'csv') {
        const text = await file.text();
        data = text.split('\n').map(line => line.split(','));
      } else if (fileExt === 'xlsx') {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer);
        const ws = wb.Sheets[wb.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      } else {
        throw new Error('Неподдерживаемый формат файла');
      }

      const headers = data[0];
      const rows = data.slice(1);

      const newColumns: Column[] = headers.map((name: string, index: number) => ({
        id: `col_${index}_${Date.now()}`,
        name: name.trim(),
        type: 'text',
      }));

      setTableData({
        ...tableData,
        columns: newColumns,
        data: rows,
      });
      
      toast.success('Данные импортированы');
    } catch (error) {
      console.error('Error importing file:', error);
      toast.error('Ошибка при импорте файла');
    }
  };

  return {
    handleAddRow,
    handleAddColumn,
    exportToCsv,
    exportToXlsx,
    importFile,
  };
};
