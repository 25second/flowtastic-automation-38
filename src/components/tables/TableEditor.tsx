import React, { useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import "handsontable/dist/handsontable.full.min.css";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TableData, Column } from './types';
import { Save, ArrowLeft, Plus, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Register Handsontable modules
registerAllModules();

interface TableEditorProps {
  tableId: string;
}

export function TableEditor({ tableId }: TableEditorProps) {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hotTableRef = React.useRef<any>(null);

  useEffect(() => {
    loadTableData();
  }, [tableId]);

  const loadTableData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_tables')
        .select('*')
        .eq('id', tableId)
        .single();

      if (error) throw error;

      const columns = Array.isArray(data.columns) 
        ? data.columns.map((col: any): Column => ({
            id: col.id || '',
            name: col.name || '',
            type: col.type || 'text',
            width: col.width
          }))
        : [];

      const parsedData: TableData = {
        id: data.id,
        name: data.name,
        columns: columns,
        data: data.data as any[][],
        cell_status: data.cell_status as boolean[][]
      };

      setTableData(parsedData);
    } catch (error) {
      console.error('Error loading table:', error);
      toast.error('Ошибка при загрузке таблицы');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tableData) return;

    try {
      const { error } = await supabase
        .from('custom_tables')
        .update({
          data: tableData.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', tableId);

      if (error) throw error;

      toast.success('Таблица сохранена');
    } catch (error) {
      console.error('Error saving table:', error);
      toast.error('Ошибка при сохранении таблицы');
    }
  };

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

      // Используем первую строку как заголовки
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

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFile(file);
    }
  };

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

  const hotSettings = {
    data: tableData.data,
    colHeaders: tableData.columns.map(col => col.name),
    rowHeaders: true,
    height: '100%',
    licenseKey: 'non-commercial-and-evaluation',
    stretchH: 'all' as const,
    contextMenu: true,
    manualColumnResize: true,
    manualRowResize: true,
    allowInsertRow: true,
    allowInsertColumn: true,
    allowRemoveRow: true,
    allowRemoveColumn: true,
    className: 'htDarkTheme',
    headerTooltips: true,
    cells: function(row: number, col: number) {
      return {
        className: 'border-border',
      };
    },
    headerStyle: {
      background: 'hsl(var(--muted))',
      color: 'hsl(var(--muted-foreground))',
      fontWeight: '500',
    },
    rowHeights: 40,
    colWidths: 120,
    selectionStyle: {
      background: 'hsla(var(--primary), 0.1)',
      border: {
        width: 2,
        color: 'hsl(var(--primary))'
      }
    },
    customBorders: true,
    tableClassName: 'font-sans text-sm',
    cellPadding: 8,
    currentRowClassName: 'bg-muted',
    currentColClassName: 'bg-muted',
    afterChange: (changes: any) => {
      if (changes) {
        setTableData(prev => {
          if (!prev) return prev;
          const newData = [...prev.data];
          changes.forEach(([row, col, oldValue, newValue]: [number, number, any, any]) => {
            newData[row][col] = newValue;
          });
          return { ...prev, data: newData };
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 h-14">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/tables')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-tight">{tableData.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAddRow} className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить строку
          </Button>
          
          <Button variant="outline" onClick={handleAddColumn} className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить колонку
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Экспорт
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCsv}>
                Экспорт в CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToXlsx}>
                Экспорт в XLSX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Импорт
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => document.getElementById('csv-import')?.click()}>
                Импорт из CSV
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => document.getElementById('xlsx-import')?.click()}>
                Импорт из XLSX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            type="file"
            id="csv-import"
            accept=".csv"
            className="hidden"
            onChange={handleImport}
          />
          <input
            type="file"
            id="xlsx-import"
            accept=".xlsx"
            className="hidden"
            onChange={handleImport}
          />

          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Сохранить
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <style>
          {`
            .handsontable {
              font-family: var(--font-sans);
              color: hsl(var(--foreground));
              height: 100% !important;
            }
            
            .handsontable th {
              background-color: hsl(var(--muted));
              color: hsl(var(--muted-foreground));
              font-weight: 500;
            }

            .handsontable td {
              background-color: hsl(var(--background));
              border-color: hsl(var(--border));
            }

            .handsontable td.current {
              background-color: hsla(var(--primary), 0.1);
            }

            .handsontable tr:hover td {
              background-color: hsl(var(--muted));
            }

            .handsontable .wtBorder.current {
              background-color: hsl(var(--primary)) !important;
            }

            .handsontable .wtBorder.area {
              background-color: hsl(var(--primary)) !important;
            }

            .handsontable .columnSorting:hover {
              color: hsl(var(--primary));
            }

            .wtHolder {
              height: 100% !important;
            }
          `}
        </style>
        <HotTable settings={hotSettings} ref={hotTableRef} />
      </div>
    </div>
  );
}
