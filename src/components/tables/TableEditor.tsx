
import React, { useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import "handsontable/dist/handsontable.full.min.css";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TableData, Column } from './types';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Register Handsontable modules
registerAllModules();

interface TableEditorProps {
  tableId: string;
}

export function TableEditor({ tableId }: TableEditorProps) {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          columns: tableData.columns,
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
    // Добавляем возможность редактирования заголовков колонок
    afterGetColHeader: (col: number, TH: HTMLTableCellElement) => {
      const headerSpan = TH.querySelector('span.colHeader');
      if (headerSpan) {
        headerSpan.addEventListener('dblclick', () => {
          const currentName = tableData.columns[col].name;
          const newName = window.prompt('Введите новое название колонки:', currentName);
          if (newName !== null && newName.trim() !== '') {
            setTableData(prev => {
              if (!prev) return prev;
              const newColumns = [...prev.columns];
              newColumns[col] = { ...newColumns[col], name: newName.trim() };
              return { ...prev, columns: newColumns };
            });
          }
        });
      }
    },
    // Обработка изменений данных
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
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Сохранить
        </Button>
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

            /* Добавляем стили для заголовков колонок */
            .handsontable th span.colHeader {
              cursor: pointer;
            }
            
            .handsontable th span.colHeader:hover {
              color: hsl(var(--primary));
            }
          `}
        </style>
        <HotTable settings={hotSettings} />
      </div>
    </div>
  );
}
