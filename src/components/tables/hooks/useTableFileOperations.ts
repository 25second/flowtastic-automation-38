
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { TableData } from '../types';

export function useTableFileOperations(
  tableData: TableData | null,
  setTableData: (data: TableData) => void
) {
  const exportToExcel = () => {
    if (!tableData) return;
    
    const ws = XLSX.utils.aoa_to_sheet(
      [
        tableData.columns.map(col => col.name),
        ...tableData.data
      ]
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${tableData.name}.xlsx`);
    toast.success('Таблица экспортирована в Excel');
  };

  const exportToCSV = () => {
    if (!tableData) return;
    
    const ws = XLSX.utils.aoa_to_sheet(
      [
        tableData.columns.map(col => col.name),
        ...tableData.data
      ]
    );
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${tableData.name}.csv`;
    link.click();
    toast.success('Таблица экспортирована в CSV');
  };

  const importFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !tableData) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        if (rows[0].length !== tableData.columns.length) {
          toast.error('Количество столбцов в импортируемом файле не совпадает с текущей таблицей');
          return;
        }

        setTableData({
          ...tableData,
          data: rows.slice(1)
        });
        toast.success('Данные импортированы успешно');
      } catch (error) {
        console.error('Error importing file:', error);
        toast.error('Ошибка при импорте файла');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return {
    exportToExcel,
    exportToCSV,
    importFile
  };
}
